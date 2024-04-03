import { type FC } from 'react';
import { BugIcon, RiskScore, SimpleSection } from '../../../../../components';
import {
	type Issues,
	topVulnerabilitiesColumn,
	Sort,
	type TableItem,
} from '../../../../../../data';
import { TableV2 } from '../../../../../components/table/tablev2';

interface DashboardVulnerabilitiesProps {
	topVulnerabilities: Issues[];
	isLoading: boolean;
}

const DashboardVulnerabilities: FC<DashboardVulnerabilitiesProps> = ({
	topVulnerabilities,
	isLoading,
}) => {
	const dataTable = topVulnerabilities.map(
		(issue: Issues) =>
			({
				ID: { value: '', style: '' },
				published: { value: issue.createdAt, style: 'date' },
				author: {
					value: '@' + issue.researcherUsername,
					style: 'username',
				},
				issueTitle: { value: issue.name, style: 'vul-title' },
				risk: { value: issue.riskLevel, style: 'vul-risk' },
				type: { value: issue.resourceClass, style: 'vul-class' },
				score: {
					value: <RiskScore riskScore={issue.riskScore} />,
					style: 'vul-score flex no-border-bottom',
				},
			}) as Record<string, TableItem>,
	);

	return (
		<div className="card">
			<div className="over">
				<SimpleSection header="Most relevant issues" icon={<BugIcon />}>
					<TableV2
						rowsData={dataTable.reverse()}
						columns={topVulnerabilitiesColumn}
						showRows={!isLoading}
						showEmpty={!isLoading && topVulnerabilities.length === 0}
						sort={Sort.asc}
					/>
				</SimpleSection>
			</div>
		</div>
	);
};

export default DashboardVulnerabilities;
