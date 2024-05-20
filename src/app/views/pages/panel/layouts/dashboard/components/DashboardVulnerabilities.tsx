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
import { ResourceIconText } from '@standalones/utils/ResourceIconText';

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
				issueTitle: {
					value: (
						<ResourceIconText
							name={issue.name}
							resourceClass={issue.resource_class}
						/>
					),
					style: 'vul-title resource-icon',
				},
				type: { value: issue.resource_class, style: 'vul-class' },
				author: {
					value: `@${issue.researcher_username}`,
					style: 'username',
				},
				score: {
					value: <RiskScore riskScore={issue.risk_score} />,
					style: 'vul-score flex no-border-bottom',
				},
				published: { value: issue.creacion, style: 'date' },
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
						selectItem={(id: any) => navigate(`/issues/${id}`)}
						sort={Sort.asc}
						urlNav="issues/update/"
					/>
				</SimpleSection>
			</div>
		</div>
	);
};

export default DashboardVulnerabilities;
