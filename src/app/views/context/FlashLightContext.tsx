import { useFlashLightManager } from '@hooks/useFlashLightManager';
import {
  type PropsWithChildren,
  type RefObject,
  createContext,
  useContext,
  useEffect,
} from 'react';

export type FlashLight = {
  isActive: boolean;
  rightPaneRef: RefObject<HTMLDivElement> | null;
};

const FlashLightContext = createContext({} as FlashLight);

export const useFlashlight = () => {
  const context = useContext(FlashLightContext);

  return { isActive: context.isActive, rightPaneRef: context.rightPaneRef };
};

export const FlashLightProvider = ({ children }: PropsWithChildren) => {
  const [flashlightRef, rightPaneRef, { handleFlashLight, isDisableFlashLight }] =
    useFlashLightManager();

  useEffect(() => {
    if (isDisableFlashLight()) {
      //Remove background flash in light mode
      flashlightRef.current!.style.background = 'transparent';
      if (rightPaneRef.current) {
        rightPaneRef.current!.style.background = 'transparent';
      }
    }
  }, [isDisableFlashLight()]);

  return (
    <FlashLightContext.Provider
      value={{
        isActive: !isDisableFlashLight(),
        rightPaneRef,
      }}>
      <div
        id="flashlight"
        ref={flashlightRef}
        onMouseMove={handleFlashLight}
        style={{ background: '' }}>
        {children}
      </div>
    </FlashLightContext.Provider>
  );
};
