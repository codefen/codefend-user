import { type FC, useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { PageLoader, PageLoaderOverlay } from '@defaults/loaders/Loader.tsx';
import { PencilIcon, SaveIcon, LeftArrowIcon } from '@icons';
import { type UpdateIssue, useUpdateIssue } from '@panelHooks/issues/useUpdateIssue.ts';
import { formatDate } from '@utils/helper.ts';
import AppEditor from './AppEditor.tsx';
import Show from '@defaults/Show.tsx';
import useLoadIframe from '@panelHooks/issues/useLoadIframe.ts';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import type { IssueUpdateData } from '@interfaces/issues.ts';

interface IssueUpdatePanelProps {
  issueData: IssueUpdateData;
  isLoading: boolean;
}

const IssueUpdatePanel: FC<IssueUpdatePanelProps> = ({ issueData, isLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditable, setEditable] = useState(true);
  const { updatedIssue, isAddingIssue, dispatch, update } = useUpdateIssue();
  const { isAdmin, isProvider } = useUserRole();
  const handleIssueUpdate = useCallback(() => {
    update()
      .then((response: any) => {
        setEditable(false);
      })
      .finally(() => {
        navigate(`/issues`);
      });
  }, [update]);
  const [isLoaded] = useLoadIframe(handleIssueUpdate);

  useEffect(
    () =>
      dispatch((state: UpdateIssue) => ({
        ...state,
        id: issueData.id,
        issueName: issueData.name || '',
        score: issueData.risk_score || '',
        resourceID: Number(issueData.resource_id || 1),
        status: issueData.condicion,
      })),
    [issueData]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name == 'resourceID' && (!value || isNaN(Number(value)))) return;

    dispatch(state => ({
      ...state,
      [name]: name == 'resourceID' ? value.replace(/[^0-9]/g, '') : value,
    }));
  };
  const handleBack = () => {
    const state = location.state;

    if (state && state?.redirect !== null) {
      navigate(state.redirect);
    } else {
      navigate('/issues');
    }
  };
  if (isLoading) return <PageLoader />;

  return (
    <>
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
        {isAdmin() || isProvider() ? (
          <div className="work-buttons">
            <div
              className={`edit action-btn  ${!isEditable ? 'on' : 'off'}`}
              onClick={() => setEditable(!isEditable)}>
              <PencilIcon isButton />
            </div>
            <div
              className={`save action-btn ${!isEditable ? 'on' : 'off'}`}
              onClick={() => handleIssueUpdate()}>
              <SaveIcon isButton />
            </div>
          </div>
        ) : null}
      </div>
      <div className="info">
        <div>
          Published: <span>{formatDate(issueData.creacion)}</span>
        </div>
        {updatedIssue.resourceID && updatedIssue.resourceID !== 0 ? (
          <div className="info-resourcer-id">
            Resource ID: <span>@{issueData.resource_id}</span>
          </div>
        ) : null}

        <div>
          Author: <span>@{issueData.researcher_username}</span>
        </div>
        <div>
          Resource: <span>{issueData.resource_class}</span>
        </div>
        <div>
          Risk:{' '}
          <select
            onChange={(e: any) =>
              dispatch(state => ({
                ...state,
                score: e.target.value,
              }))
            }
            className="py-3 focus:outline-none log-inputs"
            defaultValue={updatedIssue.score}
            name="score"
            disabled={isEditable}>
            <option value="5">critical</option>
            <option value="4">elevated</option>
            <option value="3">medium</option>
            <option value="2">low</option>
            <option value="1">intel</option>
            <option value="" hidden>
              Unknown
            </option>
          </select>
        </div>
        <div>
          Status:
          <select
            onChange={(e: any) =>
              dispatch(state => ({
                ...state,
                status: e.target.value,
              }))
            }
            className={`log-inputs`}
            defaultValue={issueData.condicion}
            name="status"
            disabled={isEditable}>
            <option value="open">open</option>
            <option value="fixed">fixed</option>
            <option value="verified">verified</option>
            <option value="" hidden>
              Unknown
            </option>
          </select>
        </div>
      </div>
      <div>
        <AppEditor
          isEditable={!isEditable}
          isLoaded={isLoaded}
          initialValue={issueData.issue}
          isCreation={false}
        />
      </div>
      <Show when={isAddingIssue}>
        <PageLoaderOverlay />
      </Show>
    </>
  );
};

export default IssueUpdatePanel;
