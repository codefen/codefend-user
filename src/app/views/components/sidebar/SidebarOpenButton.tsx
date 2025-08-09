import { useMediaQuery } from 'usehooks-ts';

export const SidebarOpenButton = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const isMobile = useMediaQuery('(max-width: 1229px)');

  if (isMobile) {
    return (
      <button
        className="sidebar-open-button-mobile no-border no-outline"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}>
        menu
      </button>
    );
  }

  return (
    <button
      className="sidebar-open-button no-border no-outline"
      onClick={toggleSidebar}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}>
      <div className="sidebar-button-line-container">
        <span className="sidebar-line-1" />
        <span className="sidebar-line-2" />
        <span className="sidebar-line-3" />
      </div>
    </button>
  );
};
