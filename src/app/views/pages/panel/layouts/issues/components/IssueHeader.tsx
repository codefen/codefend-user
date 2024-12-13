import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@defaults/Show';
import { LeftArrowIcon, PencilIcon, SaveIcon } from '@icons';
import type { UpdateIssue } from '@panelHooks/issues';
import type { ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface IssueHeaderProps {
  isEditable: boolean;
  isLoaded: boolean;
  updatedIssue: UpdateIssue;
  changeEditable: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSend: () => void;
}

export default function IssueHeader({
  isEditable,
  updatedIssue,
  isLoaded,
  changeEditable,
  handleChange,
  handleSend,
}: IssueHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isProvider } = useUserRole();
  const handleBack = () => {
    const state = location.state;
    const redirect = state?.redirect || '/issues';
    navigate(redirect);
  };

  return (
    <div className="header">
      <div className="back" onClick={handleBack}>
        <LeftArrowIcon isButton />
      </div>
      <Show when={!isEditable} fallback={<div className="name">{updatedIssue.issueName}</div>}>
        <input
          type="text"
          className="grow"
          value={updatedIssue.issueName}
          name="issueName"
          onChange={handleChange}
        />
      </Show>
      {(isAdmin() || isProvider()) && isLoaded ? (
        <div className="work-buttons">
          <div
            className={`edit action-btn  ${!isEditable ? 'on' : 'off'}`}
            onClick={changeEditable}>
            <PencilIcon isButton />
          </div>
          <div className={`save action-btn ${!isEditable ? 'on' : 'off'}`} onClick={handleSend}>
            <SaveIcon isButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
