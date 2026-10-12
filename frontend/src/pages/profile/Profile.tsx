import { useAuth } from '@/shared/lib/hooks';

import { ProfileUI } from './ProfileUI';

export const Profile = (): React.JSX.Element | null => {
  const { user } = useAuth();

  if (!user) return null;

  return <ProfileUI user={user} />;
};
