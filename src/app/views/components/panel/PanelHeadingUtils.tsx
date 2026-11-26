import { ThemeChangerButton } from '@buttons/index';
import { useNavigate } from 'react-router';
import { PeopleIconOutline } from '@icons';

export const PanelHeadingUtils = () => {
  const navigate = useNavigate();

  return (
    <div className="panel-heading-utils" role="group" aria-label="Quick actions">
      <ThemeChangerButton className="panel-util-btn" />
      <button
        type="button"
        className="panel-util-btn"
        title="User profile"
        aria-label="User profile"
        onClick={() => navigate('/user-profile')}>
        <PeopleIconOutline />
      </button>
    </div>
  );
};
