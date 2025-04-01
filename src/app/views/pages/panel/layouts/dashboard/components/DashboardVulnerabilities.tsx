import { type FC } from 'react';
import { RiskScore } from '@standalones/utils/RiskScore';
import { SimpleSection } from '@defaults/SimpleSection';
import { BugIcon } from '@icons';
import { type ColumnTableV3 } from '@interfaces/table';
import type { Issue } from '@interfaces/dashboard';
import { ResourceIconText } from '@standalones/utils/ResourceIconText';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';

interface DashboardVulnerabilitiesProps {
  topVulnerabilities: Issue[];
  isLoading: boolean;
}

const vulnera: ColumnTableV3[] = [
  {
    header: 'issue title',
    key: 'name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-1 issue-name-cell',
    weight: '47.5%',
    render: (row: any) => <ResourceIconText name={row.name} resourceClass={row.resource_class} />,
  },
  {
    header: 'class',
    key: 'resource_class',
    styles: 'item-cell-2',
    weight: '7%',
    render: (value: any) => value,
  },
  {
    header: 'author',
    key: 'researcher_username',
    styles: 'item-cell-3',
    weight: '17%',
    render: (name: any) => `@${name}`,
  },
  {
    header: 'risk level',
    key: 'risk_score',
    styles: 'item-cell-4',
    weight: '11%',
    render: (risk_score: any) => <RiskScore riskScore={risk_score} />,
  },
  {
    header: 'published',
    key: 'creacion',
    styles: 'item-cell-5',
    weight: '17.5%',
    render: (value: any) => value,
  },
];

const DashboardVulnerabilities: FC<DashboardVulnerabilitiesProps> = ({
  topVulnerabilities,
  isLoading,
}) => {
  return (
    <div className="card">
      <div className="over">
        <SimpleSection header="Most relevant issues" icon={<BugIcon />}>
          <Tablev3
            columns={vulnera}
            rows={topVulnerabilities}
            showRows={!isLoading}
            urlNav="issues/"
          />
        </SimpleSection>
      </div>
    </div>
  );
};

export default DashboardVulnerabilities;
