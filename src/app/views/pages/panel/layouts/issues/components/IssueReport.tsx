import { IssueClass, generateIDArray } from '../../../../../../data';
import { ChartIcon, Show, SimpleSection } from '../../../../../components';
import React, { Fragment, useMemo } from 'react';

interface Props {
	isLoading: boolean;
	issuesClasses: IssueClass;
	handleFilter: (issueClass: string) => void;
}

export const IssueReport: React.FC<Props> = (props) => {
	const filterIssues = useMemo(() => {
		return Object.keys(props.issuesClasses).filter(
			(item) => item !== 'total',
		);
	}, [props.issuesClasses]);

	const filterKeys = useMemo(() => {
		return generateIDArray(filterIssues.length);
	}, [filterIssues]);

	return (
		<>
			<div className="card filtered">
				<SimpleSection
					header="FILTER AND GENERATE REPORT"
					icon={<ChartIcon />}>
					<div className="content filters">
						{filterIssues.map((issueClass: string, i: number) => (
							<Fragment key={filterKeys[i]}>
								<div className="filter">
									<div className="check">
										<label className="label">
											<input
												type="checkbox"
												disabled={
													props.issuesClasses[
														issueClass as keyof typeof props.issuesClasses
													] == '0'
												}
												onChange={() =>
													props.handleFilter(issueClass)
												}
												className="codefend-checkbox"
											/>
											{issueClass}
										</label>
									</div>
									<div className="value">
										<Show
											when={
												props.issuesClasses[
													issueClass as keyof typeof props.issuesClasses
												] == '0'
											}
											fallback={
												<img
													src="/codefend/issues-bug-icon.svg"
													alt="bug-icon"
												/>
											}>
											<img
												src="/codefend/issues-bug-grey.svg"
												alt="bug-icon"
											/>
										</Show>

										<span>
											{
												props.issuesClasses[
													issueClass as keyof typeof props.issuesClasses
												]
											}
										</span>
									</div>
								</div>
							</Fragment>
						))}
					</div>
				</SimpleSection>
			</div>
		</>
	);
};
