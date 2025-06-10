import { type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table';
import type { Issue } from '@interfaces/dashboard';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { ResourceIconText } from '@/app/views/components/utils/ResourceIconText';
import { RiskScore } from '@/app/views/components/utils/RiskScore';
import { naturalTime } from '@utils/helper';
import { Link } from 'react-router';

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
}) => (
  <div className="card" id="dashboard-vulnerabilities">
    <div className="over">
      <div className="table-title">
        <h2>Issues overview</h2>
        <Link to="/issues">see all issues</Link>
      </div>
      <Tablev3 columns={vulnera} rows={topVulnerabilities} showRows={!isLoading} urlNav="issues/" />
    </div>
  </div>
);

export default DashboardVulnerabilities;
