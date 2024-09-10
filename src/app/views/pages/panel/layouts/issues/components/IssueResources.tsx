import { type FC, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { type Issues, Sort } from '../../../../../../data';
import { issueColumns, issuesColumnsWithoutAction } from '@mocks/defaultData.ts';
import { useDeleteIssue } from '@panelHooks/issues/useDeleteIssues.ts';
import useModal from '#commonHooks/useModal.ts';
import { useNewWindows } from '#commonHooks/useNewWindows.ts';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { RiskScore } from '@standalones/utils/RiskScore.tsx';
import { TrashIcon, BugIcon, MagnifyingGlassIcon } from '@icons';
import { TableV2 } from '@table/tablev2.tsx';
import '@table/table.scss';
import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@defaults/Show';
import { ResourceIconText } from '@standalones/utils/ResourceIconText';
import { ModalInput } from '@defaults/ModalInput';

interface IssueResourcesProps {
  isLoading: boolean;
  issues: Issues[];
  refresh: () => void;
  addFinding: () => void;
}

export const IssueResources: FC<IssueResourcesProps> = props => {
  const navigate = useNavigate();
  const [selected, setSelectedId] = useState('');
  const { showModal, setShowModal } = useModal();
  const { handleDelete } = useDeleteIssue();
  const { baseUrl } = useNewWindows();
  const { isProvider, isAdmin } = useUserRole();
  const [searchTerm, setTerm] = useState('');

  const dataTable = props.issues
    .filter(issue => issue.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((issue: Issues) => ({
      ID: { value: issue.id, style: '' },
      issueTitle: {
        value: <ResourceIconText name={issue.name} resourceClass={issue.resourceClass} />,
        style: 'vul-title resource-icon',
      },
      published: { value: issue.createdAt, style: 'date' },
      author: { value: `@${issue.researcherUsername}`, style: 'username' },
      type: { value: issue.resourceClass, style: 'vul-class' },
      risk: { value: issue.riskLevel, style: 'vul-risk' },
      score: {
        value: <RiskScore riskScore={issue.riskScore} />,
        style: 'vul-score',
      },
      status: {
        value: issue.condition,
        style: 'vul-condition',
      },
    }));
  const actionTable = {
    icon: [
      {
        action: (id: string) => {
          setSelectedId(id);
          setShowModal(!showModal);
        },
        render: <TrashIcon />,
        style: 'trash',
      },
    ],
  };
  return (
    <>
      <ModalTitleWrapper
        headerTitle="Delete issue"
        isActive={showModal}
        close={() => setShowModal(!showModal)}>
        <ConfirmModal
          cancelText="Cancel"
          confirmText="Delete"
          header={`Are you sure you want to delete: '${props.issues.find(issue => issue.id === selected)?.name}'?`}
          close={() => setShowModal(false)}
          action={() => {
            handleDelete(selected)?.then(() => {
              setShowModal(false);
              props.refresh();
            });
          }}
        />
      </ModalTitleWrapper>
      <div className="card">
        <div className="header">
          <div className="title">
            <div className="icon">
              <BugIcon />
            </div>
            <span>Issues</span>
          </div>
          <Show when={isAdmin() || isProvider()}>
            <div className="actions">
              <div className="" onClick={() => props.addFinding()}>
                Add finding
              </div>
            </div>
          </Show>
        </div>

        <div className="">
          <ModalInput
            icon={<MagnifyingGlassIcon />}
            setValue={(val: string) => setTerm(val)}
            placeholder="Search issue. . ."
          />
        </div>

        <TableV2
          rowsData={dataTable}
          columns={isAdmin() || isProvider() ? issueColumns : issuesColumnsWithoutAction}
          showRows={!props.isLoading}
          showEmpty={!props.isLoading && dataTable.length === 0}
          tableAction={isAdmin() || isProvider() ? actionTable : undefined}
          selectItem={(id: any) => navigate(`/issues/${id}`)}
          sort={Sort.asc}
          urlNav={`${baseUrl}/issues/`}
        />
      </div>
    </>
  );
};
