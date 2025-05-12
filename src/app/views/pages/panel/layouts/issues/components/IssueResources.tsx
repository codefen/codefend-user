import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { type ColumnTableV3, type Issues, naturalTime, Sort } from '../../../../../../data';
import { useDeleteIssue } from '@panelHooks/issues/useDeleteIssues.ts';
import useModal from '#commonHooks/useModal.ts';
import { useNewWindows } from '#commonHooks/useNewWindows.ts';
import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { TrashIcon, BugIcon, MagnifyingGlassIcon } from '@icons';
import '@table/table.scss';
import { useUserRole } from '#commonUserHooks/useUserRole';
import Show from '@/app/views/components/Show/Show';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { ResourceIconText } from '@/app/views/components/utils/ResourceIconText';
import { RiskScore } from '@/app/views/components/utils/RiskScore';

interface IssueResourcesProps {
  isLoading: boolean;
  issues: Issues[];
  refresh: () => void;
  addFinding: () => void;
}

const issueColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1',
    weight: '7.5%',
    render: value => value,
  },
  {
    header: 'Issue Title',
    key: 'name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-2',
    weight: '59%',
    render: issue => <ResourceIconText name={issue.name} resourceClass={issue.resourceClass} />,
  },
  {
    header: 'Published',
    key: 'createdAt',
    styles: 'item-cell-3 date',
    weight: '14%',
    render: value => (value ? naturalTime(value) : '--/--/--'),
  },

  //*SE OCULTARON COLUMNAS DE INFORMACIÓN *//

  // {
  //   header: 'Author',
  //   key: 'researcherUsername',
  //   styles: 'item-cell-4 username',
  //   weight: '15%',
  //   render: value => `@${value}`,
  // },
  // {
  //   header: 'Type',
  //   key: 'resourceClass',
  //   styles: 'item-cell-5',
  //   weight: '5%',
  //   render: value => value,
  // },
  // {
  //   header: 'Risk',
  //   key: 'riskLevel',
  //   styles: 'item-cell-6',
  //   weight: '5%',
  //   render: value => value,
  // },
  {
    header: 'Score',
    key: 'riskScore',
    styles: 'item-cell-7',
    weight: '14%',
    render: value => <RiskScore riskScore={value} />,
  },
  // {
  //   header: 'Status',
  //   key: 'condition',
  //   styles: 'item-cell-8',
  //   weight: '6%',
  //   render: value => value,
  // },
];

export const IssueResources: FC<IssueResourcesProps> = props => {
  const navigate = useNavigate();
  const [selected, setSelectedId] = useState('');
  const { showModal, setShowModal } = useModal();
  const { handleDelete } = useDeleteIssue();
  const { baseUrl } = useNewWindows();
  const { isProvider, isAdmin } = useUserRole();
  const [searchTerm, setTerm] = useState('');

  const dataTable = props.issues.filter(issue =>
    issue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const issuesColumnsWithActions = [
    ...issueColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-9 action',
      weight: '4.5%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span
            title="Remove issue"
            className={`trash`}
            onClick={e => {
              e.preventDefault();
              setSelectedId(row.id);
              setShowModal(!showModal);
            }}>
            <TrashIcon isButton />
          </span>
        </div>
      ),
    },
  ];
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
      <div>
        <ModalInput
          icon={<MagnifyingGlassIcon />}
          setValue={(val: string) => setTerm(val)}
          placeholder="Search issue..."
        />
      </div>

      <div className="card">
        <Tablev3
          rows={dataTable}
          columns={isAdmin() || isProvider() ? issuesColumnsWithActions : issueColumns}
          showRows={!props.isLoading}
          initialSort={Sort.asc}
          urlNav={`${baseUrl}/issues/`}
          emptyInfo="The company has no associated vulnerabilities yet, wait for one of our hackers to report a vulnerability or perform an automated scan with AI to find vulnerabilities automatically!"
        />
      </div>
    </>
  );
};
