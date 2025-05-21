import { useMemo, type FC } from 'react';
import { BugIcon } from '@icons';
import Tablev3 from '@table/v3/Tablev3';
import { useNavigate } from 'react-router';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { RiskScore } from '@/app/views/components/utils/RiskScore';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import type { Issues } from '@interfaces/index';
import { TABLE_KEYS } from '@/app/constants/app-texts';

interface Props {
  isLoading: boolean;
  issues: any | any[];
  refetch?: () => void;
}

const columns: ColumnTableV3[] = [
  {
    header: 'Published',
    key: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-issues-1',
    weight: '15%',
    render: issue =>
      issue?.createdAt || issue?.creacion ? issue?.createdAt || issue?.creacion : '--/--/--',
  },
  {
    header: 'Author',
    key: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-issues-2',
    weight: '15%',
    render: issue =>
      issue?.researcherUsername || issue?.researcher_username
        ? issue?.researcherUsername || issue?.researcher_username
        : '',
  },
  {
    header: 'Type',
    key: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-issues-3',
    weight: '15%',
    render: issue =>
      issue?.resourceClass || issue?.resource_class
        ? issue?.resourceClass || issue?.resource_class
        : '',
  },
  {
    header: 'Risk',
    key: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-issues-4',
    weight: '15%',
    render: issue =>
      issue?.riskLevel || issue?.risk_level ? issue?.riskLevel || issue?.risk_level : '',
  },
  {
    header: 'Score',
    key: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-issues-5',
    weight: '15%',
    render: issue => <RiskScore riskScore={issue?.riskScore || issue?.risk_score} />,
  },
  {
    header: 'Issue Title',
    key: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-issues-6',
    weight: '25%',
    render: issue => issue?.name,
  },
];

export const IssuesPanelMobileAndCloud: FC<Props> = props => {
  const navigate = useNavigate();
  const formatIssues = useMemo((): Issues[] => {
    if (!Array.isArray(props.issues))
      return !Boolean(Object.keys(props.issues).length) ? [] : [props.issues];

    return props.issues;
  }, [props.issues]);

  return (
    <SimpleSection header="Resource related vulnerabilities & records" icon={<BugIcon />}>
      <Tablev3
        rows={formatIssues}
        columns={columns}
        showRows={!props.isLoading}
        initialSort={Sort.desc}
        urlNav="issues/update/"
        isNeedSearchBar={true}
        isNeedSort={true}
        action={row => navigate(`/issues/${row.ID.value}`)}
        emptyInfo="No issues found"
      />
    </SimpleSection>
  );
};
