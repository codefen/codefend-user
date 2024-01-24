import React, { useCallback, useMemo, useState } from 'react';
import {
	BugIcon,
	EmptyCard,
	PageLoader,
	RiskScore,
	Show,
	SimpleSection,
	Sort,
	Table,
} from '../../../../../components';
import { Issues, topVulnerabilitiesColumn } from '../../../../../../data';
import { TableItem, TableV2 } from '../../../../../components/Table/tablev2';

interface TopVulnerability {
	published: string;
	author: string;
	type: string;
	risk: string;
	score: string;
	issueTitle: string;
	status: string;
}

const DashboardVulnerabilities: React.FC<{
	topVulnerabilities: Issues[];
	isLoading: boolean;
}> = ({ topVulnerabilities, isLoading }) => {
	const dataTable = topVulnerabilities.map(
		(issue: Issues) =>
			({
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
				status: { value: issue.condition, style: 'vul-condition' },
			}) as Record<string, TableItem>,
	);

	return (
		<div className="card">
			<div>
				<SimpleSection
					header="Top priority vulnerabilities"
					icon={<BugIcon />}>
					<TableV2
						rowsData={dataTable.reverse()}
						columns={topVulnerabilitiesColumn}
						showRows={!isLoading}
						showEmpty={!isLoading && topVulnerabilities.length === 0}
						sizeY={35}
						sort={Sort.asc}
					/>
				</SimpleSection>
			</div>
		</div>
	);
};

export default DashboardVulnerabilities;
