import type { Author } from './author';
import type { Tournament } from './tournament';

export type AutoCompleteType = 'authors' | 'tournaments';
export type SearchItem = Author | Tournament;
