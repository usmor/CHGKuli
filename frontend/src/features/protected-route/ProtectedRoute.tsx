import { useAuth } from '@shared/lib/hooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { CustomLoader } from '@/shared/ui';

export const ProtectedRoute = (): React.JSX.Element => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CustomLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
