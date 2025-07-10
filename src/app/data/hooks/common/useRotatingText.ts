import { useState, useEffect } from 'react';

// Textos rotativos editables - puedes cambiar estos fácilmente
export const ROTATING_PLAN_TEXTS = [
  '<b>Ready to see what our hackers uncover in your web when no one else can?</b><br/>Our plans connect you with real professionals — no fluff. Pick your attack level and discover vulnerabilities before the bad guys do.',
  
  '<b>Get access to ethical hackers who test your systems like real attackers would.</b> Choose the plan that fits you best and receive a manual pentest — clear, actionable, no nonsense.'
];

// Textos rotativos para Small Plans
export const ROTATING_SMALL_PLAN_TEXTS = [
  '<b>Exclusive automated plans offer a unique combination:</b> automated scanners, specialized technical support, and data leak detection. All provide unlimited access to the platform with report creation and issue visualization.',
  
  '<b>Fast, affordable security for your web applications.</b> Our plans mix automated scanners, data breach detection, and real support — with unlimited platform access to track and fix your risks.',
  
  '<b>Smart plans for web apps combining AI-powered scans,</b> leak detection and expert support. Get full access to the platform to view issues, generate reports, and stay ahead of threats.',
  
  '<b>Automated security, powered by Codefend.</b> Combine vulnerability scanners, dataleak search and expert guidance — all in one place, with full access to scan results and detailed reports.',
  
  '<b>Connect with Codefend\'s engine.</b> Scans, leaks, and expert tools at your fingertips. Get insights, not noise — and see your web security like a hacker would.'
];

// Configuración editable
export const ROTATION_CONFIG = {
  intervalMs: 5000, // 5 segundos - puedes cambiar este valor
  transitionDurationMs: 300, // 300ms de transición
};

export const useRotatingText = (texts: string[] = ROTATING_PLAN_TEXTS) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      setTimeout(() => {
        // Cambiar texto y fade in
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
      }, ROTATION_CONFIG.transitionDurationMs);
      
    }, ROTATION_CONFIG.intervalMs);

    return () => clearInterval(interval);
  }, [texts.length]);

  return {
    currentText: texts[currentIndex],
    isVisible,
    transitionStyle: {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${ROTATION_CONFIG.transitionDurationMs}ms ease-in-out`,
    }
  };
}; 