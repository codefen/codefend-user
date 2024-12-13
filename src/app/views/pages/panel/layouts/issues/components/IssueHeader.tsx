import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@defaults/Show';
import { LeftArrowIcon, PencilIcon, SaveIcon } from '@icons';
import type { SaveIssue, UpdateIssue } from '@panelHooks/issues';
import type { ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface IssueHeaderProps {
  isEditable: boolean;
  isLoaded: boolean;
  issue: UpdateIssue | SaveIssue;
  showPencil?: boolean;
  changeEditable?: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSend: () => void;
  type?: string;
  isSave?: boolean;
}

export default function IssueHeader({
  isEditable,
  issue,
  isLoaded,
  changeEditable,
  handleChange,
  handleSend,
  showPencil,
  type,
  isSave,
}: IssueHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isProvider } = useUserRole();

  const back = () => {
    if (isSave && type) {
      navigate(-1);
      return;
    } else if (isSave && !type) {
      navigate('/issues');
      return;
    }
    const state = location.state;
    const redirect = state?.redirect || '/issues';
    navigate(redirect);
  };

  return (
    <div className="header">
      <div className="back" onClick={back}>
        <LeftArrowIcon isButton />
      </div>
      <Show when={!isEditable} fallback={<div className="name">{issue.issueName}</div>}>
        <input
          type="text"
          className="grow"
          value={issue.issueName}
          name="issueName"
          placeholder="Write name..."
          onChange={handleChange}
        />
      </Show>
      {(isAdmin() || isProvider()) && isLoaded ? (
        <div className="work-buttons">
          {showPencil && (
            <div
              className={`edit action-btn  ${!isEditable ? 'on' : 'off'}`}
              onClick={() => changeEditable?.()}>
              <PencilIcon isButton />
            </div>
          )}
          <div className={`save action-btn ${!isEditable ? 'on' : 'off'}`} onClick={handleSend}>
            <SaveIcon isButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
