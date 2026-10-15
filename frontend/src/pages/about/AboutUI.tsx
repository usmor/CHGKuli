import { Stack, Tabs, Title, Text, List, Card } from '@mantine/core';
import {
  BookOpenIcon,
  QuestionIcon,
  SlidersHorizontalIcon,
  PersonSimpleIcon,
} from '@phosphor-icons/react';
import { useSearchParams } from 'react-router-dom';

import { Link, Seo } from '@/shared/ui';

import classes from './About.module.css';

export const AboutUI = (): React.JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'about';

  const handleTabChange = (value: string | null): void => {
    if (!value) return;
    setSearchParams({ tab: value });
  };
  return (
    <>
      <Seo title="О проекте" url="/about" />
      <Tabs
        defaultValue="about"
        className={classes.tabs}
        variant="outline"
        classNames={{
          tab: classes.tab,
          tabLabel: classes.tabLabel,
        }}
        value={activeTab}
        onChange={handleTabChange}
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
                . Мы собрали более 300 000 вопросов из тысяч турниров разных лет и
                сделали их удобными для поиска, чтения и игры.
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
                <List.Item>Проверить себя в игре с таймером или без</List.Item>
                <List.Item>
                  Отмечать пройденное, чтобы не натыкаться на одно и то же
                </List.Item>
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
                . ЧГКули <b>не</b> автор базы! Вопросы написаны десятками тысяч знатоков,
                и права на них остаются у авторов. Мы только собрали их в одном месте и
                добавили удобства.
              </Text>
            </Stack>

            <Stack gap="xs">
              <Title order={5}>Обратная связь</Title>
              <Text>
                Если нашли баг, хотите предложить идею или просто сказать спасибо, пишите
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
              хорошей истории: завязка, разгадка и пояснение. Разберём, из чего он
              состоит.
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
                    Что именно засчитывается. Иногда ответ можно сформулировать
                    по-разному, и здесь написано, какие варианты примут
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
                    Человек или целая команда, которая создала вопрос
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
              галочка: такие вопросы <b>не показываются снова</b> в играх.
            </Text>
            <Text>
              Отметка ставится вручную на странице вопроса или автоматически после
              завершения игры. Снять отметку можно на странице вопроса или в разделе
              «Пройденные вопросы» в личном кабинете.
            </Text>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="modes" pt="xl">
          <Stack gap="l">
            <Title order={2}>Режимы работы с вопросами</Title>

            <Stack gap="xs">
              <Title order={5}>Все, что есть</Title>
              <Text>
                Вся база на одной странице в виде карточек-превью: турнир, год, начало
                вопроса, авторы. Клик открывает полный вопрос с ответом, критериями и
                комментарием.
              </Text>
              <List spacing="xs" withPadding>
                <List.Item>
                  Без фильтров = вся база подряд с бесконечной прокруткой
                </List.Item>
                <List.Item>
                  С фильтрами по автору, турниру или году = своя подборка
                </List.Item>
                <List.Item>
                  Пройденные вопросы можно отмечать на странице вопроса, тогда они не
                  попадут в будущие игры
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
                <List.Item>Настройка количества вопросов</List.Item>
                <List.Item>Таймер на вопрос с возможностью поставить на паузу</List.Item>
                <List.Item>
                  Данные игр сохраняются у авторизованных пользователей
                </List.Item>
                <List.Item>
                  Ничего страшного, если вы не вошли в аккаунт до начала, это можно
                  сделать в любой момент до того, как результат сохранён. После входа
                  игра автоматически привяжется к вашему профилю
                </List.Item>
                <List.Item>
                  Если игра не закончена, её можно продолжить с того же места ––– из
                  истории игр в личном кабинете
                </List.Item>
              </List>
            </Stack>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="account" pt="xl">
          <Stack gap="l">
            <Title order={2}>Личный кабинет</Title>
            <Text>
              Здесь всё, что связано с вашим профилем: данные, код для игр, статистика,
              пройденные вопросы и история игр.
            </Text>

            <Stack gap="xs">
              <Title order={5}>Личный код</Title>
              <Text>
                Чтобы добавить вас в чужую игру, организатору нужны ваше имя и{' '}
                <b>личный код</b>. Код обновляется каждый день, его можно посмотреть в
                профиле и скопировать одним нажатием.
              </Text>
              <Text>
                Никому не передавайте код, кроме организатора игры, в которую хотите
                попасть.
              </Text>
            </Stack>
            <Stack gap="xs">
              <Title order={5}>Статистика</Title>
              <Text>
                Сколько вопросов вы прошли, сколько игр провели, сколько прошло времени в
                играх и как давно вы с нами. Общая картина прогресса.
              </Text>
            </Stack>

            <Stack gap="xs">
              <Title order={5}>Пройденные вопросы</Title>
              <Text>
                Список вопросов с отметкой. Пройденные вопросы не показываются снова в
                играх.
              </Text>
              <Text>
                Здесь можно искать по фильтрам и снимать отметку, если хотите вернуть
                вопрос в выдачу.
              </Text>
            </Stack>

            <Stack gap="xs">
              <Title order={5}>История игр</Title>
              <Text>
                Каждая завершённая или начатая игра сохраняется: дата, состав команды,
                сколько вопросов прошли и сколько ответили правильно. Можно посмотреть,
                какие вопросы были в игре и, был ли ваш ответ правильным или нет.
              </Text>
              <Text>
                Незавершённую игру можно продолжить с того же места, а завершённую —
                скрыть из списка, если она больше не нужна.
              </Text>
            </Stack>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
