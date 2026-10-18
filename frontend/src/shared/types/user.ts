export type User = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
};

export type UserStats = {
  questions_passed: number;
  games_played: number;
  registered_at: string;
  days_since_registration: number;
  total_time_seconds: number;
};
