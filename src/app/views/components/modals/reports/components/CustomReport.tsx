import React from 'react';
import {
	BugIcon,
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

interface CustomReportProps {
	isModal?: boolean;
	forceOpen?: boolean;
}

export const CustomReport: React.FC<CustomReportProps> = ({
	isModal,
	forceOpen,
}) => {
	const { open } = useReportStore((state) => state);
	const { isLoading, getResources, getShare, getIssues } = useReportInfoStore(
		(state) => state,
	);
	const { navigateNewWindow, baseUrl } = useNewWindows();
	const resources = getResources();
	const resourceDomainText = resources
		? resources?.[0]?.resourceDomain || '. . .'
		: '. . .';

	const scopeDataTable = resources.map(
		(mainNetwork: Webresources, i: number) => ({
			ID: { value: mainNetwork.id, style: 'id' },
			domainName: {
				value: mainNetwork.resourceDomain,
				style: 'domain-name',
			},
			mainServer: {
				value: mainNetwork.mainServer,
				style: 'server-ip',
			},
			location: {
				value: (
					<LocationItem
						key={mainNetwork.id + i + '-l'}
						country={mainNetwork.serverCountry}
						countryCode={mainNetwork.serverCountryCode}
					/>
				),
				style: 'location',
			},
			childs: {
				value: (
					<>
						{mainNetwork.childs.map((subNetwork: Resouce, i: number) => (
							<div key={'child-' + subNetwork.id} className="item">
								<div className="id">{subNetwork.id}</div>
								<div className="domain-name lined">
									<span className="sub-domain-icon-v"></span>
									<span className="sub-domain-icon-h"></span>
									<span className="sub-resource-domain">
										{subNetwork.resourceDomain}
									</span>
								</div>

								<div className="server-ip">{subNetwork.mainServer}</div>
								<div className="location">
									<LocationItem
										key={subNetwork.id + i + '-lc'}
										country={subNetwork.serverCountry}
										countryCode={subNetwork.serverCountryCode}
									/>
								</div>
							</div>
						))}
					</>
				),
				style: '',
			},
		}),
	);

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

	return (
		<div className="issues-reports" id="issue-web-report">
			{(open && !isLoading) || (forceOpen && !isLoading) ? (
				<>
					<div className="issues-report-header">
						<ExecutiveSummaryIcon />
						<h1>{resourceDomainText} Executive summary</h1>

						{isModal ? (
							<button
								className="download-pdf-btn"
								onClick={() => navigateNewWindow(`/report`)}>
								Download PDF
							</button>
						) : (
							''
						)}
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
						<BugIcon />
						<h2>scope & assets & attack surface</h2>
					</div>

					<p className="print-break">
						Security assessments were conducted within the following
						located resources. Several of these resources were
						automatically detected and added by our staff and software and
						may not contain regular content.
					</p>

					<TableWithoutActions
						columns={webResourcesWithoutActions}
						resources={scopeDataTable}
						isLoading={isLoading}
						id={2}
						needMarker
					/>

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

					<div className="issues-report-header">
						<BugIcon />
						<h2>scope & assets & attack surface</h2>
					</div>
					<p>
						Security assessments were conducted within the following
						located resources. Several of these resources were
						automatically detected and added by our staff and software and
						may not contain regular content.
					</p>

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
				</>
			) : (
				<PageLoader />
			)}
		</div>
	);
};
