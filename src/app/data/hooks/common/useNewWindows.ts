export const useNewWindows = () => {
  const currentUrl = window.location.href;
  const baseUrl = currentUrl.split('/').slice(0, 3).join('/');

  const navigateNewWindow = (path: string) => {
    const newUrl = `${baseUrl}${path}`;
    window.open(newUrl, '_blank', 'noopener,noreferrer');
  };

  return { navigateNewWindow, baseUrl };
};
