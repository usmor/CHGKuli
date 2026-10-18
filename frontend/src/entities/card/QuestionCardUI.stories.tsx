import { ProgressBadge } from '@shared/ui';

import { QuestionCardUI } from './QuestionCardUI';

import type { Question } from '@shared/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof QuestionCardUI> = {
  title: 'Entities/Question/QuestionCardUI',
  component: QuestionCardUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: () => React.JSX.Element): React.JSX.Element => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof QuestionCardUI>;

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

export const Default: Story = {
  args: {
    question: baseQuestion,
  },
};

export const WithProgressBadge: Story = {
  args: {
    question: baseQuestion,
    badge: <ProgressBadge isPassed />,
  },
};

export const LongText: Story = {
  args: {
    question: {
      ...baseQuestion,
      question_text: 'Очень длинный текст вопроса. '.repeat(20),
    },
    previewLength: 100,
  },
};

export const ShortText: Story = {
  args: {
    question: {
      ...baseQuestion,
      question_text: 'Короткий вопрос?',
    },
  },
};

export const MultipleAuthors: Story = {
  args: {
    question: {
      ...baseQuestion,
      authors: [
        { id: 1, name: 'Юлия Дидбаридзе' },
        { id: 2, name: 'Григорий Зырянов' },
        { id: 3, name: 'Фёдор Журавлёв' },
      ],
    },
  },
};

export const NoAuthors: Story = {
  args: {
    question: {
      ...baseQuestion,
      authors: [],
    },
  },
};

export const NoTournament: Story = {
  args: {
    question: {
      ...baseQuestion,
      tournament: null,
    },
  },
};

export const TournamentWithoutYear: Story = {
  args: {
    question: {
      ...baseQuestion,
      tournament: {
        id: 5,
        name: 'Синхронный турнир «Что-то вроде „В конце ноября“»',
        year: null,
      },
    },
  },
};

export const NoAuthorsNoTournament: Story = {
  args: {
    question: {
      ...baseQuestion,
      authors: [],
      tournament: null,
    },
  },
};

export const FullDataWithBadge: Story = {
  args: {
    question: baseQuestion,
    badge: <ProgressBadge isPassed />,
  },
};

export const MinimalWithBadge: Story = {
  args: {
    question: {
      ...baseQuestion,
      authors: [],
      tournament: null,
    },
    badge: <ProgressBadge isPassed />,
  },
};
