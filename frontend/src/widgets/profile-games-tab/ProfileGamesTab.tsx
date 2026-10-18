import { useMyGames } from '@shared/lib/hooks';
import { useState } from 'react';

import { ProfileGamesTabUI } from './ProfileGamesTabUI';

export const ProfileGamesTab = (): React.JSX.Element => {
  const [showHidden, setShowHidden] = useState(false);
  const { data, isLoading, isError } = useMyGames(50, true);

  return (
    <ProfileGamesTabUI
      games={data ?? []}
      isLoading={isLoading}
      isError={isError}
      showHidden={showHidden}
      onShowHiddenChange={setShowHidden}
    />
  );
};
