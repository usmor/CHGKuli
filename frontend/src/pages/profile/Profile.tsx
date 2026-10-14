import { useAuth, useDailyCode } from '@/shared/lib/hooks';

import { ProfileUI } from './ProfileUI';

export const Profile = (): React.JSX.Element | null => {
  const { user } = useAuth();
  const dailyCodeQuery = useDailyCode();

  if (!user) return null;

  return <ProfileUI user={user} dailyCodeQuery={dailyCodeQuery} />;
};
