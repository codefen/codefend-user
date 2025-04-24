import { type FC } from 'react';
import { BugIcon } from '@icons';
import { type ColumnTableV3 } from '@interfaces/table';
import type { Issue } from '@interfaces/dashboard';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { ResourceIconText } from '@/app/views/components/utils/ResourceIconText';
import { RiskScore } from '@/app/views/components/utils/RiskScore';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { naturalTime } from '@utils/helper';

interface DashboardVulnerabilitiesProps {
  topVulnerabilities: Issue[];
  isLoading: boolean;
}

const vulnera: ColumnTableV3[] = [
  {
    header: 'published',
    key: 'creacion',
    styles: 'item-cell-5',
    weight: '17%',
    render: (value: any) => naturalTime(value),
  },
  {
    header: 'issue title',
    key: 'name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-1 issue-name-cell',
    weight: '50%',
    render: (row: any) => <ResourceIconText name={row.name} resourceClass={row.resource_class} />,
  },
  // {
  //   header: 'class',
  //   key: 'resource_class',
  //   styles: 'item-cell-2',
  //   weight: '7%',
  //   render: (value: any) => value,
  // },
  // {
  //   header: 'author',
  //   key: 'researcher_username',
  //   styles: 'item-cell-3',
  //   weight: '17%',
  //   render: (name: any) => `@${name}`,
  // },
  {
    header: 'score',
    key: 'risk_score',
    styles: 'item-cell-4',
    weight: '27%',
    render: (risk_score: any) => <RiskScore riskScore={risk_score} />,
  },
];

const DashboardVulnerabilities: FC<DashboardVulnerabilitiesProps> = ({
  topVulnerabilities,
  isLoading,
}) => {
  return (
    <div className="card">
      <div className="over">
        <div className="table-title">
          <h2>Issues overview</h2>
          <a href="/">see all overviews</a>
        </div>
        <Tablev3
          columns={vulnera}
          rows={topVulnerabilities}
          showRows={!isLoading}
          urlNav="issues/"
        />
      </div>
    </div>
  );
};

export default DashboardVulnerabilities;
