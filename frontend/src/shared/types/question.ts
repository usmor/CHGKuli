import type { Author } from './author';
import type { Tournament } from './tournament';

export type Question = {
  id: number;
  question_text: string;
  answer: string;
  pass_criteria: string | null;
  comment: string | null;
  tournament_id: number;
  tournament: Tournament | null;
  authors: Author[];
  author_ids: number[];
};
