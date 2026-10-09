import { QuestionCard } from '@entities/index';

import { CarouselUI } from './CarouselUI';

import type { Question } from '@shared/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

const meta: Meta<typeof CarouselUI> = {
  title: 'Widgets/Carousel/CarouselUI',
  component: CarouselUI,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CarouselUI>;

const baseQuestion: Question = {
  id: 1,
  question_text:
    'Взаимодействие с матерью часто определяет направление развития ребёнка. Для своего проекта художница Сесилия Йонссон собрала несколько образцов плаценты и создала основной элемент ИКСА, использовав выделенный из ИГРЕКА металл. Назовите ИКС и ИГРЕК словами, которые начинаются на парные согласные.',
  answer: 'компас, гемоглобин',
  pass_criteria: '',
  comment:
    'через плаценту плоду передаётся кислород и питательные вещества, важную роль в этом процессе играет гемоглобин.',
  tournament_id: 5,
  tournament: {
    id: 5,
    name: 'Синхронный турнир «Что-то вроде „В конце ноября“»',
    year: 2023,
  },
  authors: [{ id: 1, name: 'Юлия Дидбаридзе' }],
  author_ids: [1],
};

const createQuestion = (id: number): Question => ({
  ...baseQuestion,
  id,
  question_text: `Вопрос №${id}. ${baseQuestion.question_text}`,
});

const questions: Question[] = Array.from({ length: 10 }, (_, i) =>
  createQuestion(i + 1)
);

export const Default: Story = {
  args: {
    items: questions.map((q) => <QuestionCard key={q.id} question={q} />),
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: [<QuestionCard key={1} question={questions[0]} />],
  },
};

export const FewItems: Story = {
  args: {
    items: questions.slice(0, 3).map((q) => <QuestionCard key={q.id} question={q} />),
  },
};

export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 30 }, (_, i) => {
      const q = createQuestion(i + 1);
      return <QuestionCard key={q.id} question={q} />;
    }),
  },
};
