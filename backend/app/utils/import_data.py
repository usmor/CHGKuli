import pickle
import re
import sys
from collections import Counter
from typing import Any

from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession
from tqdm import tqdm

from app.core.db import AsyncSessionLocal
from app.models import Author, Question, Tournament, question_author_association


def parse_year(year_str: str) -> int | None:
    """
    Парсинг года из строки.
    """
    if not year_str or not isinstance(year_str, str):
        return None

    year_str = year_str.strip()
    if not year_str:
        return None

    match = re.search(r"\b(\d{4})\b", year_str)
    if match:
        year = int(match.group(1))
        if 1800 <= year <= 2100:
            return year
    return None


def load_pickle_data(file_path: str = "chgk_data.pkl") -> dict[str, Any]:
    """Загрузка данных из pickle файла"""
    print("Загрузка данных из chgk_data.pkl файла...")
    with open(file_path, "rb") as f:
        data = pickle.load(f)

    print("Загружено:")
    print(f"  • Турниров: {len(data.get('tournaments', []))}")
    print(f"  • Авторов: {len(data.get('authors', []))}")
    print(f"  • Вопросов: {len(data.get('questions', []))}")

    return data


async def import_authors(db: AsyncSession, authors_data: list[dict]) -> int:
    """Импорт авторов из данных"""

    print("Импортируем авторов...")
    count = 0
    with tqdm(total=len(authors_data), desc="Авторы", unit="шт") as pbar:
        for item in authors_data:
            name = item.get("name")
            if name:
                result = await db.execute(
                    select(Author).where(Author.id == item.get("id"))
                )
                existing = result.scalar_one_or_none()

                if not existing:
                    result = await db.execute(select(Author).where(Author.name == name))
                    existing = result.scalar_one_or_none()

                if not existing:
                    author = Author(id=item.get("id"), name=name)
                    db.add(author)
                    count += 1
            pbar.update(1)

    await db.commit()
    print(f"Импортировано {count} авторов")
    return count


async def import_tournaments(db: AsyncSession, tournaments_data: list[dict]) -> int:
    """Импорт турниров из данных"""
    print("Импортируем турниры...")

    count = 0
    with tqdm(total=len(tournaments_data), desc="Турниры", unit="шт") as pbar:
        for item in tournaments_data:
            name = item.get("title")
            year_str = item.get("date", "")
            if name:
                result = await db.execute(
                    select(Tournament).where(Tournament.id == item.get("id"))
                )
                existing = result.scalar_one_or_none()

                if not existing:
                    result = await db.execute(
                        select(Tournament).where(Tournament.name == name)
                    )
                    existing = result.scalar_one_or_none()

                if not existing:
                    year = parse_year(year_str)
                    tournament = Tournament(id=item.get("id"), name=name, year=year)
                    db.add(tournament)
                    count += 1
            pbar.update(1)

    await db.commit()
    print(f"Импортировано {count} турниров")
    return count


async def import_questions(
    db: AsyncSession, questions_data: list[dict], existing_author_ids: set
) -> int:
    """
    Импорт вопросов из данных.
    """
    print("Импортируем вопросы...")

    count = 0
    skipped = 0

    skip_reasons = Counter()
    questions_without_authors = 0

    with tqdm(total=len(questions_data), desc="Вопросы", unit="шт") as pbar:
        for item in questions_data:
            question_text = item.get("question_text")
            answer = item.get("answer")
            tournament_id = item.get("tournament_id")
            author_ids = item.get("author_ids", [])

            # Проверка: есть ли текст вопроса
            if not question_text:
                skip_reasons["no_question_text"] += 1
                skipped += 1
                pbar.update(1)
                continue

            # Проверка: есть ли ответ
            if not answer:
                skip_reasons["no_answer"] += 1
                skipped += 1
                pbar.update(1)
                continue

            # Проверка: есть ли tournament_id
            if not tournament_id:
                skip_reasons["no_tournament_id"] += 1
                skipped += 1
                pbar.update(1)
                continue

            # Проверка: существует ли турнир в БД
            result = await db.execute(
                select(Tournament).where(Tournament.id == tournament_id)
            )
            tournament = result.scalar_one_or_none()

            if not tournament:
                skip_reasons["tournament_not_found"] += 1
                skipped += 1
                pbar.update(1)
                continue

            # Подсчет вопросов без авторов
            if not author_ids:
                questions_without_authors += 1

            # Проверяем всех авторов - все должны существовать в БД
            unique_author_ids = list(set(author_ids))
            invalid_authors = [
                aid for aid in unique_author_ids if aid not in existing_author_ids
            ]

            # Если есть некорректные ID - пропускаем вопрос
            if invalid_authors:
                skip_reasons["invalid_author_ids"] += 1
                skipped += 1
                pbar.update(1)
                continue

            # Проверка на дубликат вопроса
            result = await db.execute(
                select(Question).where(
                    Question.question_text == question_text,
                    Question.tournament_id == tournament_id,
                )
            )
            existing = result.scalar_one_or_none()

            if existing:
                skip_reasons["duplicate"] += 1
                skipped += 1
                pbar.update(1)
                continue

            # Создаем вопрос
            question = Question(
                question_text=question_text.strip(),
                answer=answer.strip(),
                pass_criteria=item.get("pass_criteria", "").strip() or None,
                comment=item.get("comment", "").strip() or None,
                tournament_id=tournament_id,
            )
            db.add(question)
            await db.flush()

            # Добавляем связи с авторами
            for author_id in unique_author_ids:
                stmt = sqlite_insert(question_author_association).values(
                    question_id=question.id, author_id=author_id
                )
                stmt = stmt.prefix_with("OR IGNORE")
                await db.execute(stmt)

            count += 1

            if count % 500 == 0:
                await db.commit()

            pbar.update(1)

    await db.commit()

    # Выводим статистику
    print("\n" + "=" * 60)
    print("📊 ДЕТАЛЬНАЯ СТАТИСТИКА ИМПОРТА ВОПРОСОВ")
    print("=" * 60)

    print(f"\n✅ Успешно импортировано: {count}")
    print(f"❌ Всего пропущено: {skipped}")

    if skip_reasons:
        print("\n📋 ПРИЧИНЫ ПРОПУСКОВ:")
        total_skipped = sum(skip_reasons.values())
        for reason, cnt in sorted(
            skip_reasons.items(), key=lambda x: x[1], reverse=True
        ):
            pct = cnt / total_skipped * 100 if total_skipped > 0 else 0
            print(f"  • {reason}: {cnt} ({pct:.1f}%)")

    print("\n📊 СТАТИСТИКА ПО АВТОРАМ:")
    print(f"  • Вопросов без авторов: {questions_without_authors}")

    print("\n" + "=" * 60)

    return count


async def import_all_data(pickle_path: str = "chgk_data.pkl"):
    """Импорт всех данных из pickle файла"""
    async with AsyncSessionLocal() as db:
        try:
            data = load_pickle_data(pickle_path)

            # 1. Импортируем авторов
            if data.get("authors"):
                await import_authors(db, data["authors"])
            else:
                print("Данные авторов не найдены")

            # 2. Импортируем турниры
            if data.get("tournaments"):
                await import_tournaments(db, data["tournaments"])
            else:
                print("Данные турниров не найдены")

            # 3. Импортируем вопросы
            if data.get("questions"):
                result = await db.execute(select(Author.id))
                existing_author_ids = {row[0] for row in result.all()}

                print(f"\n✅ В БД найдено {len(existing_author_ids)} авторов")

                await import_questions(db, data["questions"], existing_author_ids)
            else:
                print("Данные вопросов не найдены")

            print("\nИмпорт данных завершен!")

        except FileNotFoundError:
            print(f"\nФайл {pickle_path} не найден!")
            raise
        except Exception as e:
            print(f"\nОшибка при импорте: {e}")
            await db.rollback()
            raise


if __name__ == "__main__":
    import asyncio

    file_path = sys.argv[1] if len(sys.argv) > 1 else "data/chgk_data.pkl"
    asyncio.run(import_all_data(file_path))
