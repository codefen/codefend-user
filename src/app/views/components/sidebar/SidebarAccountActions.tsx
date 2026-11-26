import { LogoutIcon } from '@icons';

export const SidebarAccountActions = ({ onSignOut }: { onSignOut: () => void }) => {
  return (
    <div className="panel-sidebar-actions" role="group" aria-label="Panel controls">
      <button type="button" onClick={onSignOut} title="Sign out" aria-label="Sign out">
        <LogoutIcon width={1} height={1} />
        <span className="sidebar-item-label">Sign out</span>
      </button>
    </div>
  );
};
