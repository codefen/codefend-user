export const useNewWindows = () => {
  const appBase = import.meta.env.BASE_URL.replace(/\/$/, '');
  const baseUrl = `${window.location.origin}${appBase}`;

  const navigateNewWindow = (path: string) => {
    const newUrl = `${baseUrl}${path}`;
    window.open(newUrl, '_blank', 'noopener,noreferrer');
  };

  return { navigateNewWindow, baseUrl };
};
