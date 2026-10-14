import { useMyGames } from '@shared/lib/hooks';

import { ProfileGamesTabUI } from './ProfileGamesTabUI';

export const ProfileGamesTab = (): React.JSX.Element => {
  const { data, isLoading, isError } = useMyGames(50);

  return (
    <ProfileGamesTabUI games={data ?? []} isLoading={isLoading} isError={isError} />
  );
};
