import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';

const ProtectedRoute = ({ children, isAllowed }: { children: ReactNode; isAllowed: boolean }) => {
  const { getAccessToken, isCurrentAuthValid } = useUserRole();
  if (!getAccessToken() || !isCurrentAuthValid()) {
    return <Navigate to="/auth/signin" replace />;
  }
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
