import type { Question } from './question';

export type GameStatus = 'setup' | 'active' | 'finished';

export type GameFilters = {
  author_ids: number[];
  tournament_ids: number[];
  year_from: number | null;
  year_to: number | null;
};

export type GamePlayerShort = {
  id: number;
  user_id: number;
  username: string;
};

export type GameQuestionItem = {
  id: number;
  order: number;
  is_answered: boolean;
  time_spent_seconds: number | null;
  question: Question;
};

export type Game = {
  id: number;
  owner_id: number | null;
  title: string | null;
  status: GameStatus;
  has_timer: boolean;
  time_per_question: number | null;
  questions_count: number;
  filters: GameFilters | null;
  started_at: string | null;
  finished_at: string | null;
  answered_count: number;
  players: GamePlayerShort[];
  questions: GameQuestionItem[];
  warning: string | null;
  is_finished: boolean;
};

export type GameShort = {
  id: number;
  title: string | null;
  status: GameStatus;
  questions_count: number;
  answered_count: number;
  started_at: string | null;
  finished_at: string | null;
  is_finished: boolean;
  players: GamePlayerShort[];
};

export type GameWithToken = {
  game: Game;
  guest_token: string | null;
};
