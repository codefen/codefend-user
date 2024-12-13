import { useState } from 'react';
import useTimeout from './useTimeout';

export const useCopyToClipboard = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { oneExecute: successExe } = useTimeout(() => setSuccess(false), 2000);
  const { oneExecute: errorExe } = useTimeout(() => setError(false), 2000);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSuccess(true);
        successExe();
      })
      .catch(() => {
        setError(true);
        errorExe();
      });
  };

  return [copyToClipboard, { error, success }] as const;
};
