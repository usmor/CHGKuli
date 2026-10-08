import { Stack, Tabs, Title, Text, List, Card } from '@mantine/core';
import {
  BookOpenIcon,
  QuestionIcon,
  SlidersHorizontalIcon,
  PersonSimpleIcon,
} from '@phosphor-icons/react';

import { Link } from '@/shared/ui';

import classes from './About.module.css';

export const AboutUI = (): React.JSX.Element => {
  return (
    <Tabs
      defaultValue="about"
      className={classes.tabs}
      variant="outline"
      classNames={{
        tab: classes.tab,
        tabLabel: classes.tabLabel,
      }}
    >
      <Tabs.List className={classes.tabsList}>
        <Tabs.Tab
          value="about"
          leftSection={<BookOpenIcon size={18} weight="regular" />}
        >
          О проекте
        </Tabs.Tab>
        <Tabs.Tab
          value="question"
          leftSection={<QuestionIcon size={18} weight="regular" />}
        >
          Анатомия вопроса
        </Tabs.Tab>
        <Tabs.Tab
          value="modes"
          leftSection={<SlidersHorizontalIcon size={18} weight="regular" />}
        >
          Режимы работы
        </Tabs.Tab>
        <Tabs.Tab
          value="account"
          leftSection={<PersonSimpleIcon size={18} weight="regular" />}
        >
          Личный кабинет
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="about" pt="xl">
        <Stack gap="l">
          <Stack gap="xs">
            <Title order={2}>Что такое ЧГКули</Title>
            <Text>
              ЧГКули — это база вопросов «Что? Где? Когда?», собранная из открытого
              архива{' '}
              <Link
                href="https://db.chgk.info"
                text="db.chgk.info"
                c="var(--purple-haze)"
              />
              . Мы собрали более 300 000 вопросов из тысяч турниров разных лет и сделали
              их удобными для поиска, чтения и игры.
            </Text>
          </Stack>

          <Stack gap="xs">
            <Title order={5}>Зачем это нужно</Title>
            <Text>
              Мы устали от архивов, где вопросы приходится искать по крупицам. ЧГКули —
              это способ работать с базой ЧГК удобно:
            </Text>
            <List spacing="sm" withPadding>
              <List.Item>Найти вопросы конкретного автора или турнира</List.Item>
              <List.Item>Собрать набор под настроение за пару кликов</List.Item>
              <List.Item>Проверить себя в игре с таймером</List.Item>
              <List.Item>Отмечать пройденное и возвращаться к избранному</List.Item>
            </List>
          </Stack>

          <Stack gap="xs">
            <Title order={5}>Источник данных</Title>
            <Text>
              Все вопросы взяты с{' '}
              <Link
                href="https://db.chgk.info"
                text="db.chgk.info"
                c="var(--purple-haze)"
              />
              . ЧГКули — не автор базы: вопросы написаны десятками тысяч знатоков, и
              права на них остаются у авторов. Мы только собрали их в одном месте и
              добавили удобства.
            </Text>
          </Stack>

          <Stack gap="xs">
            <Title order={5}>Обратная связь</Title>
            <Text>
              Если нашли баг, хотите предложить идею или просто сказать спасибо — пишите
              в{' '}
              <Link
                href="https://github.com/usmor/CHGKuli/issues"
                text="GitHub Issues"
                c="var(--purple-haze)"
              />
              .
            </Text>
          </Stack>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="question" pt="xl">
        <Stack gap="l">
          <Title order={2}>Как устроен вопрос</Title>
          <Text>
            Вопрос в ЧГК — это не просто «текст и ответ». У него есть структура, как у
            хорошей истории: завязка, разгадка и пояснение. Разберём, из чего он состоит.
          </Text>

          <Card withBorder padding="lg">
            <Stack gap="xs">
              <div>
                <Text fw={600}>📖 Текст вопроса</Text>
                <Text c="var(--purple-haze)">То, что читают знатокам.</Text>
              </div>

              <div>
                <Text fw={600}>✅ Ответ</Text>
                <Text c="var(--purple-haze)">
                  То, ради чего всё затевалось. Иногда очевидный, а иногда «как я не
                  догадался?»
                </Text>
              </div>

              <div>
                <Text fw={600}>📏 Критерии зачёта</Text>
                <Text c="var(--purple-haze)">
                  Что именно засчитывается. Иногда ответ можно сформулировать по-разному
                  — здесь написано, какие варианты примут
                </Text>
              </div>

              <div>
                <Text fw={600}>💬 Комментарий</Text>
                <Text c="var(--purple-haze)">
                  Пояснение от автора: почему ответ именно такой, какие ходы были в
                  вопросе. Часто интереснее самого вопроса
                </Text>
              </div>

              <div>
                <Text fw={600}>✍️ Автор</Text>
                <Text c="var(--purple-haze)">
                  Человек, который всё это придумал. Иногда — целая команда
                </Text>
              </div>

              <div>
                <Text fw={600}>🏆 Турнир и год</Text>
                <Text c="var(--purple-haze)">
                  Паспорт вопроса: где, когда и на каком турнире его задали
                </Text>
              </div>
            </Stack>
          </Card>
          <Title order={4}>Отметка о прохождении</Title>
          <Text>
            Если вы авторизованы, у пройденных вопросов будет пометка. Это не просто
            галочка: такие вопросы <b>не показываются снова</b> — ни в фильтрах, ни в
            играх.
          </Text>
          <Text>
            Отметка ставится вручную на странице вопроса или автоматически после игры.
            Снять её можно в личном кабинете — тогда вопрос вернётся в выдачу.
          </Text>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="modes" pt="xl">
        <Stack gap="l">
          <Title order={2}>Режимы работы с вопросами</Title>

          <Stack gap="xs">
            <Title order={5}>Все, что есть</Title>
            <Text>
              Вся база на одной странице — карточки с превью: турнир, год, начало
              вопроса, авторы. Клик открывает полный вопрос с ответом, критериями и
              комментарием.
            </Text>
            <List spacing="xs" withPadding>
              <List.Item>
                Без фильтров — вся база подряд, с бесконечной прокруткой
              </List.Item>
              <List.Item>
                С фильтрами по автору, турниру или году — своя подборка
              </List.Item>
            </List>
          </Stack>

          <Stack gap="xs">
            <Title order={5}>Игра</Title>
            <Text>
              Формат турнира: отвечаете на вопросы под таймер, проверяете себя.
            </Text>
            <List spacing="xs" withPadding>
              <List.Item>Фильтры: автор, турнир, год</List.Item>
              <List.Item>Ограничение по количеству вопросов и по времени</List.Item>
              <List.Item>Ответили досрочно — нажмите «Ответ готов»</List.Item>
            </List>
          </Stack>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="account" pt="xl">
        <Stack gap="l">
          <Title order={2}>Личный кабинет</Title>

          <Text>
            Здесь всё, что связано с вашими вопросами: прогресс и список пройденных. Пока
            это только начало, но со временем раздел будет расти.
          </Text>

          <Stack gap="xs">
            <Title order={5}>Статистика</Title>
            <Text>
              Сколько вопросов вы прошли, сколько осталось и как давно играли. Общая
              картина прогресса.
            </Text>
          </Stack>

          <Stack gap="xs">
            <Title order={5}>Пройденные вопросы</Title>
            <Text>
              Список вопросов с отметкой. Пройденные вопросы не показываются снова — ни в
              наборах, ни в играх.
            </Text>
            <Text>Отметку можно снять, если хотите вернуть вопрос в выдачу.</Text>
          </Stack>

          <Stack gap="xs">
            <Title order={5}>История игр</Title>
            <Text>
              Каждая игра сохраняется: когда играли, какой был набор, сколько вопросов
              прошли и сколько ответили правильно. Можно вернуться к слабым местам или
              повторить любимые вопросы.
            </Text>
          </Stack>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
};
