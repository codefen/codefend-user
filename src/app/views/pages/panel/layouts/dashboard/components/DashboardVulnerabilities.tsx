import { type FC } from 'react';
import { BugIcon, RiskScore, SimpleSection } from '../../../../../components';
import {
	type Issues,
	topVulnerabilitiesColumn,
	Sort,
	type TableItem,
} from '../../../../../../data';
import { TableV2 } from '../../../../../components/table/tablev2';
import { useNavigate } from 'react-router';

interface DashboardVulnerabilitiesProps {
	topVulnerabilities: Issues[];
	isLoading: boolean;
}

const DashboardVulnerabilities: FC<DashboardVulnerabilitiesProps> = ({
	topVulnerabilities,
	isLoading,
}) => {
	const navigate = useNavigate();
	const dataTable = topVulnerabilities.map(
		(issue: Issues) =>
			({
				ID: { value: issue.id, style: '' },
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
						selectItem={(id: any) => navigate(`/issues/update/${id}`)}
						sort={Sort.asc}
					/>
				</SimpleSection>
			</div>
		</div>
	);
};

export default DashboardVulnerabilities;
