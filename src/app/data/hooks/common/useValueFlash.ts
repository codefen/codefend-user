import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook that provides a CSS class to create a "flash" effect when a value changes.
 * @param value The value to monitor for changes.
 * @returns A CSS class name ('value-updated') when the value changes, otherwise an empty string.
 */
export const useValueFlash = (value: any) => {
  const [flashClass, setFlashClass] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the effect on the initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Set the class to trigger the animation
    setFlashClass('value-updated');

    // Remove the class after the animation duration (1s)
    const timer = setTimeout(() => {
      setFlashClass('');
    }, 1000);

    // Cleanup the timer on unmount or if the value changes again
    return () => clearTimeout(timer);
  }, [value]);

  return flashClass;
}; 