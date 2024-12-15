import { useTheme } from '@/app/views/context/ThemeContext';
import { useCallback, useState } from 'react';

const useLoadIframe = (keyDownExc: () => void, extraExc?: () => void) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  const loadIframe = useCallback(() => {
    return new Promise<() => void>((resolve, reject) => {
      const observer = new MutationObserver(() => {
        const iframe = document.getElementById('issue_ifr') as HTMLIFrameElement | null;

        if (iframe) {
          observer.disconnect();

          const contentWindow = iframe.contentWindow;
          if (!contentWindow) {
            reject(new Error('No se pudo acceder al contentWindow'));
            return;
          }

          const keydownHandler = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 's') {
              event.preventDefault();
              keyDownExc();
            }
          };
          const body = contentWindow.document.body;
          body?.setAttribute?.('data-theme', theme);
          contentWindow.addEventListener('keydown', keydownHandler);

          extraExc?.();
          setIsLoaded(true);

          resolve(() => {
            contentWindow.removeEventListener('keydown', keydownHandler);
          });
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error('Timeout al buscar iframe'));
      }, 8000);
    });
  }, [theme, keyDownExc, extraExc]);

  return [isLoaded, loadIframe] as const;
};

export default useLoadIframe;
