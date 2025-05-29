export const SidebarOpenButton = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
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
