import React from 'react';
import {
	BugIcon,
	GlobeWebIcon,
	ExecutiveSummaryIcon,
	LocationItem,
	PageLoader,
	RiskScore,
} from '../../..';
import { TableWithoutActions } from '../../../Table/TableWithoutActions';
import {
	IssuesShare,
	ReportIssues,
	Resouce,
	Webresources,
	cleanHTML,
	formatDate,
	issuesColumnsWithoutAction,
	useNewWindows,
	useReportInfoStore,
	useReportStore,
	webResourcesWithoutActions,
} from '../../../../../data';
import { RiskWithoutAction } from './RiskWithoutAction';
import { WebResourceScope } from './WebResourceScope';
import { MobileResourceScope } from './MobileResourceScope';

interface CustomReportProps {
	isModal?: boolean;
	forceOpen?: boolean;
}

export const CustomReport: React.FC<CustomReportProps> = ({
	isModal,
	forceOpen,
}) => {
	const { open, resourceType } = useReportStore((state) => state);
	const { isLoading, getResources, getShare, getIssues } = useReportInfoStore(
		(state) => state,
	);
	const { navigateNewWindow } = useNewWindows();
	const resources = getResources();
	let resourceDomainText = '. . .';

	if (resourceType === 'web') {
		resourceDomainText = resources?.[0]?.resourceDomain || '. . .';
	} else if (resourceType === 'mobile' || resourceType === 'cloud') {
		resourceDomainText = resources?.appName || '. . .';
	}

	const vulnerabilityDataTable = getIssues().map(
		(issue: ReportIssues, i: number) => ({
			published: { value: issue.createdAt, style: 'date' },
			author: {
				value: issue.researcherUsername,
				style: 'username',
			},
			type: { value: issue.resourceClass, style: 'vul-class' },
			risk: { value: issue.riskLevel, style: 'vul-risk' },
			score: {
				value: (
					<RiskScore
						key={issue.id + i + '-rs'}
						riskScore={issue.riskScore}
					/>
				),
				style: 'vul-score',
			},
			issueTitle: { value: issue.name, style: 'vul-title' },
			status: { value: issue.condition, style: 'vul-condition' },
		}),
	);

	const ActiveScope = () => {
		if (resourceType === 'web') {
			return (
				<WebResourceScope resources={resources} isLoading={isLoading} />
			);
		} else if (resourceType === 'mobile' || resourceType === 'cloud') {
			return (
				<MobileResourceScope resources={resources} isLoading={isLoading} />
			);
		}

		return <></>;
	};

	if ((open && !isLoading) || (forceOpen && !isLoading)) {
		if (!isModal) {
			return (
				<div className='issues-reports tab'>
					{' '}
					<div className="main-header">
						<ExecutiveSummaryIcon />
						<h1>{resourceDomainText} Executive summary</h1>
					</div>
					<p>
						Our Red Team performed a security assessment of the internal
						corporate network of {resourceDomainText}. The penetration
						test simulated an attack from an external threat actor
						attempting to gain access to systems within Fractal corporate
						network. The purpose of this assessment was to discover and
						identify vulnerabilities in {resourceDomainText}
						infrastructure and suggest methods to remediate the
						vulnerabilities.{' '}
						<em>
							A total of "issues_share" vulnerabilities have been
							identified within the scope of the engagement
						</em>{' '}
						which are broken down by severity in the table below.
					</p>
					<div className="graph">
						<RiskWithoutAction
							vulnerabilityByRisk={getShare() as IssuesShare}
							isLoading={false}
						/>
					</div>
					<hr />
					<div className="issues-report-header">
						<GlobeWebIcon />
						<h2>scope & assets & attack surface</h2>
					</div>
					<p className="print-break">
						Security assessments were conducted within the following
						located resources. Several of these resources were
						automatically detected and added by our staff and software and
						may not contain regular content.
					</p>
					<ActiveScope />
					<hr />
					<div className="issues-report-header">
						<BugIcon />
						<h2>Vulnerabilities found in the structure</h2>
					</div>
					<p>
						The highest severity vulnerabilities give potential attackers
						the opportunity to completely take over user accounts from the
						client with the corresponding risks. In order to ensure data
						confidentiality, integrity, and availability, security
						remediations should be implemented as described in the
						security assessment findings.
					</p>
					<TableWithoutActions
						isLoading={isLoading}
						resources={vulnerabilityDataTable}
						columns={issuesColumnsWithoutAction}
						id={3}
					/>
					<hr />
					
					{getIssues().map((issue: ReportIssues, i: number) => (
						<div key={i + '-issue'}>
							<div className="issue-header">
								<div className="issues-report-header issue-header-name">
									<BugIcon />
									<h3>{issue.name}</h3>
								</div>
								<div className="issue-header-info">
									<div>
										Published:{' '}
										<span>{formatDate(issue.createdAt)}</span>
									</div>
									<div>
										Author: <span>@{issue.researcherUsername}</span>
									</div>
									<div>
										Risk score: <span>{issue.riskScore}</span>
									</div>
									<div>
										Severity: <span>{issue.riskLevel}</span>
									</div>
									<div>
										Status: <span>{issue.condition}</span>
									</div>
								</div>
							</div>
							<div
								className="issue-main-content"
								dangerouslySetInnerHTML={{
									__html: issue.content,
								}}></div>
						</div>
					))}
				</div>
			);
		}
		return (
			<div className="issues-reports" id="issue-web-report">
				<div className="issues-report-header">
					<ExecutiveSummaryIcon />
					<h1>{resourceDomainText} Executive summary</h1>

					{isModal ? (
						<a
							className="download-pdf-btn"
							href="/report"
							target="_blank">
							Download PDF
						</a>
					) : (
						''
					)}
				</div>

				<p>
					Our Red Team performed a security assessment of the internal
					corporate network of {resourceDomainText}. The penetration test
					simulated an attack from an external threat actor attempting to
					gain access to systems within Fractal corporate network. The
					purpose of this assessment was to discover and identify
					vulnerabilities in {resourceDomainText}
					infrastructure and suggest methods to remediate the
					vulnerabilities.{' '}
					<em>
						A total of "issues_share" vulnerabilities have been identified
						within the scope of the engagement
					</em>{' '}
					which are broken down by severity in the table below.
				</p>
				<div className="graph">
					<RiskWithoutAction
						vulnerabilityByRisk={getShare() as IssuesShare}
						isLoading={false}
					/>
				</div>

				<hr />

				<div className="issues-report-header">
					<GlobeWebIcon />
					<h2>scope & assets & attack surface</h2>
				</div>

				<p className="print-break">
					Security assessments were conducted within the following located
					resources. Several of these resources were automatically detected
					and added by our staff and software and may not contain regular
					content.
				</p>

				<ActiveScope />

				<hr />

				<div className="issues-report-header">
					<BugIcon />
					<h2>Vulnerabilities found in the structure</h2>
				</div>
				<p>
					The highest severity vulnerabilities give potential attackers the
					opportunity to completely take over user accounts from the client
					with the corresponding risks. In order to ensure data
					confidentiality, integrity, and availability, security
					remediations should be implemented as described in the security
					assessment findings.
				</p>

				<TableWithoutActions
					isLoading={isLoading}
					resources={vulnerabilityDataTable}
					columns={issuesColumnsWithoutAction}
					id={3}
				/>

				<hr />

				{getIssues().map((issue: ReportIssues, i: number) => (
					<div key={i + '-issue'}>
						<div className="issue-header">
							<div className="issues-report-header issue-header-name">
								<BugIcon />
								<h3>{issue.name}</h3>
							</div>
							<div className="issue-header-info">
								<div>
									Published: <span>{formatDate(issue.createdAt)}</span>
								</div>
								<div>
									Author: <span>@{issue.researcherUsername}</span>
								</div>
								<div>
									Risk score: <span>{issue.riskScore}</span>
								</div>
								<div>
									Severity: <span>{issue.riskLevel}</span>
								</div>
								<div>
									Status: <span>{issue.condition}</span>
								</div>
							</div>
						</div>
						<div
							className="issue-main-content"
							dangerouslySetInnerHTML={{
								__html: issue.content,
							}}></div>
					</div>
				))}
			</div>
		);
	} else {
		return (
			<div className="issues-reports" id="issue-web-report">
				<PageLoader />
			</div>
		);
	}
};
