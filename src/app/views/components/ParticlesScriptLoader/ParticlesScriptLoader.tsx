import { useEffect } from 'react';

const ParticlesScriptLoader = () => {
  useEffect(() => {
    const loadParticlesScript = () => {
      const particlesScript = document.createElement('script');
      particlesScript.src = '/particles/particles.js';
      particlesScript.async = true;
      particlesScript.onload = () => {
        const appScript = document.createElement('script');
        appScript.src = '/particles/app.js';
        appScript.async = true;
        document.body.appendChild(appScript);
        return () => {
          document.body.removeChild(appScript);
        };
      };
      document.body.appendChild(particlesScript);
      return () => {
        document.body.removeChild(particlesScript);
      };
    };

    loadParticlesScript();
  }, []);

  return (
    <div id="particles-js">
      <canvas className="particles-js-canvas-el"></canvas>
    </div>
  );
};

export default ParticlesScriptLoader;
