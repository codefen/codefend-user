import { useMemo, type FC } from 'react';
import { RiskScore } from '@standalones/utils/RiskScore';
import { BugIcon } from '@icons';
import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import { TableV2 } from '@table/tablev2';
import { useNavigate } from 'react-router';
import { type Issues, cloudAndMobileColumns, Sort } from '../../../data';

interface Props {
  isLoading: boolean;
  issues: any | any[];
  refetch?: () => void;
}

export const IssuesPanelMobileAndCloud: FC<Props> = props => {
  const navigate = useNavigate();
  const formatIssues = useMemo((): Issues[] => {
    if (!Array.isArray(props.issues))
      return !Boolean(Object.keys(props.issues).length) ? [] : [props.issues];

    return props.issues;
  }, [props.issues]);

  const dataTable = formatIssues.map((issue: any) => ({
    ID: { value: Number(issue.id), style: '' },
    published: { value: issue?.createdAt || issue?.creacion, style: 'date' },
    author: {
      value: issue?.researcherUsername || issue?.researcher_username,
      style: 'username',
    },
    type: {
      value: issue?.resourceClass || issue?.resource_class,
      style: 'vul-class',
    },
    risk: { value: issue?.riskLevel || issue?.risk_level, style: 'vul-risk' },
    score: {
      value: <RiskScore riskScore={issue?.riskScore || issue?.risk_score} />,
      style: 'vul-score',
    },
    issueTitle: { value: issue?.name, style: 'vul-title' },
  }));
  return (
    <SimpleSection header="Resource related vulnerabilities & records" icon={<BugIcon />}>
      <TableV2
        rowsData={dataTable}
        columns={cloudAndMobileColumns}
        showRows={!props.isLoading}
        showEmpty={!props.isLoading && formatIssues.length === 0}
        selectItem={(id: any) => navigate(`/issues/${id}`)}
        urlNav="issues/update/"
        sort={Sort.desc}
      />
    </SimpleSection>
  );
};
