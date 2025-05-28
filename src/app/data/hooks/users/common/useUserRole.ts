import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

export const useUserRole = () => {
  const { user, session } = useGlobalFastFields(['user', 'session']);
  const getRole = () => user.get?.access_role || '';
  const isNormalUser = () => user.get?.access_role === 'user';
  const isAdmin = () => user.get?.access_role === 'admin';
  const isProvider = () => user.get?.access_role === 'provider';
  const isReseller = () => user.get?.access_role === 'reseller';

  const isCurrentAuthValid = () => !!session.get;
  const getAccessToken = () => session.get;

  return {
    getRole,
    isProvider,
    isReseller,
    isAdmin,
    isNormalUser,
    getAccessToken,
    isCurrentAuthValid,
    idiom: user.get?.idiom || 'en',
  };
};
