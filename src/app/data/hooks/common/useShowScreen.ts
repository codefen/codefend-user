import { useEffect, useState } from 'react';
import useTimeout from './useTimeout';

export const useShowScreen = () => {
  const [showScreen, setShowScreen] = useState<boolean>(false);
  const [control, setControl] = useState<boolean>(false);
  const { oneExecute } = useTimeout(() => {
    setShowScreen(true);
  }, 50);

  useEffect(() => {
    setShowScreen(false);
    oneExecute();
    //timeoutRef = setTimeout(() => callback(), delay);
  }, [control]);

  const refresh = () => setControl(!control);

  return [showScreen, control, refresh] as const;
};
