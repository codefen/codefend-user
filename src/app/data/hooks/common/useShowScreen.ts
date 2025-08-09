import { useEffect, useState } from 'react';
import useTimeout from './useTimeout';
/**
 * Este Hook sirve para mostrar el contenido de la pagina luego de 50ms util para mostrar animacion de entrada
 */
export const useShowScreen = () => {
  const [showScreen, setShowScreen] = useState<boolean>(false);
  // Cambiar el control sirve para hacer un "refresh" de la pagina
  const [control, setControl] = useState<boolean>(false);
  const { oneExecute } = useTimeout(() => {
    // console.log('🔍 [DEBUG] useShowScreen - oneExecute called, setting showScreen to true');
    setShowScreen(true);
  }, 50);

  useEffect(() => {
    // console.log('🔍 [DEBUG] useShowScreen - control changed, setting showScreen to false');
    setShowScreen(false);
    oneExecute();
  }, [control]);

  const refresh = () => setControl(!control);

  // Debug log cuando showScreen cambia
  useEffect(() => {
    console.log('🔍 [DEBUG] useShowScreen - showScreen changed to:', showScreen);
  }, [showScreen]);

  return [showScreen, control, refresh] as const;
};
