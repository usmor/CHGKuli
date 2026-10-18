import type { Question } from '@/shared/types';

export const mockQuestions: Question[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  question_text: `Тестовый вопрос №${i + 1}. ${'Длинный текст. '.repeat(5)}`,
  answer: 'Ответ',
  pass_criteria: null,
  comment: null,
  tournament_id: 1,
  tournament: {
    id: 1,
    name: 'Синхронный турнир «Что-то вроде»',
    year: 2023,
  },
  authors: [{ id: 1, name: 'Юлия Дидбаридзе' }],
  author_ids: [1],
}));
