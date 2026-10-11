import { useAuth } from '@shared/lib/hooks';

import { HeaderUI } from './HeaderUI';

export const Header = (): React.JSX.Element => {
  const { user, logout } = useAuth();
  return <HeaderUI user={user} logout={logout} />;
};
