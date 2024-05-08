import { type FC } from 'react';
import { BugIcon, RiskScore, SimpleSection } from '../../../../../components';
import {
	topVulnerabilitiesColumn,
	Sort,
	type TableItem,
} from '../../../../../../data';
import { TableV2 } from '../../../../../components/table/tablev2';
import { useNavigate } from 'react-router';
import type { Issue } from '@interfaces/dashboard';

interface DashboardVulnerabilitiesProps {
	topVulnerabilities: Issue[];
	isLoading: boolean;
}

const DashboardVulnerabilities: FC<DashboardVulnerabilitiesProps> = ({
	topVulnerabilities,
	isLoading,
}) => {
	const navigate = useNavigate();
	const dataTable = topVulnerabilities.map(
		(issue: Issue) =>
			({
				ID: { value: issue.id, style: '' },
				published: { value: issue.creacion, style: 'date' },
				author: {
					value: '@' + issue.researcher_username,
					style: 'username',
				},
				issueTitle: { value: issue.name, style: 'vul-title' },
				risk: { value: issue.risk_level, style: 'vul-risk' },
				type: { value: issue.resource_class, style: 'vul-class' },
				score: {
					value: <RiskScore riskScore={issue.risk_score} />,
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
						selectItem={(id: any) => navigate(`/issues/update/${id}`)}
						sort={Sort.asc}
						urlNav="issues/update/"
					/>
				</SimpleSection>
			</div>
		</div>
	);
};

export default DashboardVulnerabilities;
