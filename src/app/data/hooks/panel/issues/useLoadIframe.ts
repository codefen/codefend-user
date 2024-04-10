import { useTheme } from '@/app/views/ThemeContext';
import { useEffect, useRef, useState } from 'react';

const MAX_ATTEMPTS = 10; // Número máximo de intentos para cargar el iframe

const useLoadIframe = (keyDownExc: ()=>any, extraExc?: ()=>void) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();
  const attemptsRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const contentWindowRef = useRef<WindowProxy | null>(null);

  const handleKeyDown = (event: any) => {
    if (event.ctrlKey && (event.key === 's' || event.keyCode === 83)) {
        event.preventDefault();
        keyDownExc();
    }
};

  const sleep = (ms:number) => {
    return new Promise((resolve) => {
        timeoutIdRef.current = setTimeout(resolve, ms);
    });
  };

  const clear = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current!);
      timeoutIdRef.current = null;
    }
  };

  const updateTinyMceTheme = (contentWindow: WindowProxy) => {
    const body = contentWindow.document.body;
    if (body) {
      body.setAttribute('data-theme', theme);
    }
  };

  const loadIframe = (attempts: number, maxAttempts: number, theme: string): any => {
    const iframe = document.getElementById(
        'issue_ifr',
    ) as HTMLIFrameElement | null;

    if (!iframe) {
      attemptsRef.current++;
      if (attemptsRef.current < MAX_ATTEMPTS) {
        clear();
        return sleep(200).then(() => loadIframe(attempts, maxAttempts, theme));
      } 
      console.error('Se superó el número máximo de intentos para cargar el iframe.');
    clear();
      return;
    }

    contentWindowRef.current = iframe.contentWindow as WindowProxy;

    if (contentWindowRef.current && contentWindowRef.current.document.readyState === 'complete') {
        updateTinyMceTheme(contentWindowRef.current!);
    } else {
        const onLoad = ()=> updateTinyMceTheme(contentWindowRef.current!);
        iframe.onload = onLoad;
    }

    contentWindowRef.current.addEventListener('keydown', handleKeyDown);
    if(extraExc) extraExc();
    setIsLoaded(true);
  };

  useEffect(() => {
    setIsLoaded(false);
    loadIframe(attemptsRef.current, MAX_ATTEMPTS, theme);
    return ()=>{
        if (contentWindowRef.current) {
            contentWindowRef.current.removeEventListener('keydown', handleKeyDown);
        }
        clear();
    };
  }, []);

  return [isLoaded] as const;
};

export default useLoadIframe;