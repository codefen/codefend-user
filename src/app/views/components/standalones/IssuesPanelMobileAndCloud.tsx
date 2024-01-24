import React, { useMemo } from 'react';
import {
	BugIcon,
	RiskScore,
	SimpleSection,
	TrashIcon,
	TableV2,
	Sort,
} from '..';
import { useNavigate } from 'react-router';
import { Issues, cloudAndMobileColumns } from '../../../data';

interface Props {
	isLoading: boolean;
	issues: Issues[] | Issues;
	refetch?: () => void;
}

export const IssuesPanelMobileAndCloud: React.FC<Props> = (props) => {
	const navigate = useNavigate();
	const formatIssues = useMemo((): Issues[] => {
		if (!Array.isArray(props.issues))
			return !Boolean(Object.keys(props.issues).length)
				? []
				: [props.issues];

		return props.issues;
	}, [props.issues]);

	const dataTable = formatIssues.map((issue) => ({
		published: { value: issue.createdAt, style: 'date' },
		author: { value: issue.researcherUsername, style: 'username' },
		type: { value: issue.resourceClass, style: 'vul-class' },
		risk: { value: issue.riskLevel, style: 'vul-risk' },
		score: {
			value: <RiskScore riskScore={issue.riskScore} />,
			style: 'vul-score',
		},
		issueTitle: { value: issue.name, style: 'vul-title' },
	}));
	return (
		<SimpleSection
			header="Resource related vulnerabilities & records"
			icon={<BugIcon />}>
			<TableV2
				rowsData={dataTable}
				columns={cloudAndMobileColumns}
				showRows={!props.isLoading}
				showEmpty={!props.isLoading && formatIssues.length === 0}
				sizeY={30}
				sort={Sort.desc}
			/>
		</SimpleSection>
	);
};
