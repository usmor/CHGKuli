import { SimpleGrid, Stack } from '@mantine/core';
import {
  CalendarIcon,
  ClockIcon,
  GameControllerIcon,
  QuestionIcon,
} from '@phosphor-icons/react';
import { useMyStats } from '@shared/lib/hooks';
import { formatTime } from '@shared/lib/utils';
import { CustomAlert, CustomLoader, StatCard } from '@shared/ui';

const questionsJoke = (n: number): string => {
  if (n === 0) return 'Пока ни одного. Но ты только начинаешь!';
  if (n < 10) return 'Начало положено. Дальше больше.';
  if (n < 50) return 'Уже не новичок.';
  if (n < 100) return 'Кто-то явно заходит сюда не в первый раз.';
  if (n < 200) return 'Солидный запас.';
  if (n < 500) return 'Ты явно не промах.';
  if (n < 1000) return 'Еще чуть-чуть, и первая тысяча';
  if (n < 5000) return 'Перед настойчивым и горы преклоняются.';
  if (n < 10_000) return 'Более пяти тысяч. Это уже серьёзный запас.';
  if (n < 25_000) return 'Десятки тысяч. Нескромная коллекция.';
  if (n < 50_000) return 'Это уже не хобби, это образ жизни.';
  if (n < 100_000) return 'Сто тысяч = круглая дата. Можно и отметить.';
  if (n < 150_000) return 'Сто тысяч перевалил. Скромно молчим и завидуем.';
  if (n < 200_000) return 'Двести тысяч. Ты вообще спишь?';
  if (n < 250_000) return 'Четверть миллиона. Это уже статистическая аномалия.';
  if (n < 300_000) return 'Скоро вся база. Держись.';
  if (n < 350_000) return 'Ты прошёл больше, чем средний игрок когда-либо увидит.';
  return 'Ты, кажется, прошёл всё. Что дальше?';
};

const gamesJoke = (n: number): string => {
  if (n === 0) return 'Пока ни одной. Но ты только начинаешь!';
  if (n === 1) return 'С чего-то надо было начать.';
  if (n < 5) return 'Первые игры. Осваиваешься.';
  if (n < 10) return 'Затягивает, да?';
  if (n < 25) return 'Уже можно называть это хобби.';
  if (n < 50) return 'Уже не новичок.';
  if (n < 100) return 'Сотня игр. Серьёзный подход.';
  if (n < 200) return 'Солидный запас.';
  if (n < 300) return 'Кажется, ты больше, чем фанат ЧКГ.';
  if (n < 500) return 'Ты знаешь больше, чем среднестатистический знаток.';
  return 'Больше пятисот игр. Ты в зале славы.';
};

const timeJoke = (seconds: number): string => {
  const h = seconds / 3600;
  if (h < 1) return 'Меньше часа. Разминка.';
  if (h < 5) return 'Пара часов в думах.';
  if (h < 20) return 'Уже прилично наиграл.';
  if (h < 100) return 'Несколько рабочих дней в думах.';
  if (h < 250) return 'Больше сотни. Ты явно не новичок.';
  if (h < 500) return 'Без труда не вынешь и рыбку из пруда. Про тебя.';
  if (h < 1000) return 'Больше пятисот часов. Дело мастерах боится.';
  if (h < 2000) return 'Тысяча часов. Ты явно не промах.';
  return 'Может, пора выйти на улицу? Хотя бы ненадолго.';
};

const daysJoke = (n: number): string => {
  if (n === 0) return 'Первый день. Добро пожаловать в клуб!';
  if (n < 7) return 'Первая неделя. Начало положено.';
  if (n < 30) return 'Месяц. Уже не гость.';
  if (n < 90) return 'Пара месяцев, а ты всё ещё тут. Хороший знак.';
  if (n < 180) return 'Полгода. Можно считать своим.';
  if (n < 365) return 'Уже почти год. Весьма солидно.';
  if (n < 730) return 'Больше года. Серьезный срок.';
  if (n < 1095) return 'Два года. Стабильность - признак мастерства.';
  if (n < 1825) return 'Три года. Пора уже медаль.';
  if (n < 2555) return 'Четыре года. Легенда.';
  return 'Пять лет. Пора открывать собственный турнир.';
};

export const ProfileStatsTab = (): React.JSX.Element => {
  const { data, isLoading, isError } = useMyStats();

  if (isLoading) {
    return (
      <Stack align="center" py="xl">
        <CustomLoader />
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <CustomAlert
        message="Попробуйте обновить страницу позже."
        title="Не удалось загрузить статистику."
      />
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      <StatCard
        icon={<QuestionIcon size={20} />}
        label="Пройдено вопросов"
        value={data.questions_passed}
        joke={questionsJoke(data.questions_passed)}
      />
      <StatCard
        icon={<GameControllerIcon size={20} />}
        label="Игр проведено"
        value={data.games_played}
        joke={gamesJoke(data.games_played)}
      />
      <StatCard
        icon={<ClockIcon size={20} />}
        label="Время в игре"
        value={formatTime(data.total_time_seconds)}
        joke={timeJoke(data.total_time_seconds)}
      />
      <StatCard
        icon={<CalendarIcon size={20} />}
        label="С нами"
        value={`${data.days_since_registration} дн.`}
        joke={daysJoke(data.days_since_registration)}
      />
    </SimpleGrid>
  );
};
