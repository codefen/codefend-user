import React, { useEffect, lazy, useRef, useState } from 'react';
import {
	BugIcon,
	ExecutiveSummaryIcon,
	PageLoader,
	RiskScore,
	GlobeWebIcon,
	AimIcon,
	DownloadIcon,
} from '../../..';
import { TableWithoutActions } from '../../../Table/TableWithoutActions';
import {
	IssuesShare,
	ReportIssues,
	formatDate,
	getCurrentDate,
	issuesColumnsWithoutAction,
	mapCloudApp,
	mapIssueShare,
	mapIssueShareV2,
	mapIssues,
	mapMobileApp,
	mapWebresourceApiToWebresource,
	removeSpecialCharacters,
	useIssueReport,
	useReportStore,
} from '../../../../../data';
import { RiskWithoutAction } from './RiskWithoutAction';
import { WebResourceScope } from './WebResourceScope';
import { MobileResourceScope } from './MobileResourceScope';
import { ReportFrontpage } from './ReportFrontpage';
const Logo = lazy(() => import('../../../defaults/Logo'));

interface CustomReportProps {
	isModal?: boolean;
	forceOpen?: boolean;
}

export const CustomReport: React.FC<CustomReportProps> = ({
	isModal,
	forceOpen,
}) => {
	const resources = useRef<any>(null);
	const issues = useRef<any>(null);
	const share = useRef<any>(null);
	const [resourceDomainText, setDomainText] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const { open, resourceType } = useReportStore((state: any) => state);
	const { fetchReport, abort } = useIssueReport();

	useEffect(() => {
		const removeAttributeFromBody = () => {
			document.body.removeAttribute('print-report');
			document.title = 'Codefend';
		};
		if (!resources.current) {
			console.log('Ejecuto ref en tab?');
			fetchReport()
				.then((response: any) => {
					issues.current = response.issues.map((issue: any) =>
						mapIssues(issue),
					);
					share.current = mapIssueShareV2(response);

					if (resourceType === 'web') {
						console.log('entro a wenb');
						resources.current = [
							mapWebresourceApiToWebresource(response.resource),
						];
					} else if (resourceType === 'mobile') {
						resources.current = mapMobileApp(response.resource);
					} else if (resourceType === 'cloud') {
						resources.current = mapCloudApp(response.resource);
					}
					if (resources.current) {
						if (resourceType === 'web') {
							console.log('Entro ?');
							setDomainText(resources.current[0].resourceDomain);
						} else if (
							resourceType === 'mobile' ||
							resourceType === 'cloud'
						) {
							setDomainText(resources.current.appName);
						}
					}
				})
				.finally(() => {
					if (!isModal) {
						setTimeout(() => window.print(), 2000);
					}
					setIsLoading(false);
				});
		}
		return () => {
			abort.abort();
			if (!isModal) {
				removeAttributeFromBody();
			}
		};
	}, []);

	const vulnerabilityDataTable = issues.current
		? issues.current.map((issue: ReportIssues, i: number) => ({
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
			}))
		: [];

	const ActiveScope = () => {
		if (resourceType === 'web') {
			return (
				<WebResourceScope
					resources={resources.current}
					isLoading={isLoading}
				/>
			);
		} else if (resourceType === 'mobile' || resourceType === 'cloud') {
			return (
				<MobileResourceScope
					resources={resources.current}
					isLoading={isLoading}
				/>
			);
		}

		return <></>;
	};

	if (!isModal && resources.current) {
		document.body.setAttribute('print-report', 'true');
		const createdAt = Array.isArray(resources.current)
			? resources.current?.[0]?.createdAt || ''
			: resources.current?.createdAt || '';

		document.title = `${formatDate(createdAt)}-${removeSpecialCharacters(resourceDomainText)}`;
	}

	if ((open && !isLoading) || (forceOpen && !isLoading)) {
		return (
			<div className={`issues-report ${!isModal ? 'tab' : ''}`}>
				{!isModal ? (
					<ReportFrontpage resourceDomainText={resourceDomainText} />
				) : (
					<a
						className="download-pdf-btn"
						title="download pdf"
						href="/report"
						target="_blank">
						<DownloadIcon />
					</a>
				)}
				<div className="intro">
					<div className="title">
						<ExecutiveSummaryIcon />
						<h1>
							{resourceDomainText} <span>Executive summary</span>
						</h1>
					</div>
					<div className="contenido">
						<p>
							Our Red Team performed a security assessment of the
							internal corporate network of {resourceDomainText}.{' '}
							<br></br>The penetration test simulated an attack from an
							external threat actor attempting to gain access to systems
							within Fractal corporate network. The purpose of this
							assessment was to discover and identify vulnerabilities in{' '}
							{resourceDomainText}
							infrastructure and suggest methods to remediate the
							vulnerabilities.
							<em>
								A total of "issues_share" vulnerabilities have been
								identified within the scope of the engagement
							</em>
							which are broken down by severity in the table below.
						</p>
						<div className="graph">
							<RiskWithoutAction
								vulnerabilityByRisk={share.current as IssuesShare}
								isLoading={isLoading}
							/>
						</div>
					</div>
				</div>

				<div className="section">
					<div className="title-main">
						<GlobeWebIcon />
						<h2>scope & assets & attack surface</h2>
					</div>
					<div className="contenido">
						<p className="print-break">
							Security assessments were conducted within the following
							located resources. Several of these resources were
							automatically detected and added by our staff and software
							and may not contain regular content.
						</p>
						<ActiveScope />
					</div>
				</div>

				<div className="section">
					<div className="title-main">
						<BugIcon />
						<h2>Vulnerabilities found in the structure</h2>
					</div>
					<div className="contenido">
						<p>
							The highest severity vulnerabilities give potential
							attackers the opportunity to completely take over user
							accounts from the client with the corresponding risks. In
							order to ensure data confidentiality, integrity, and
							availability, security remediations should be implemented
							as described in the security assessment findings.
						</p>
						<TableWithoutActions
							isLoading={isLoading}
							resources={vulnerabilityDataTable}
							columns={issuesColumnsWithoutAction}
							id={3}
						/>
					</div>
				</div>

				{issues.current
					? issues.current.map((issue: ReportIssues, i: number) => (
							<div key={i + '-issue'}>
								<div className="issue-header">
									<div className="title-main issue-header-name">
										<BugIcon />
										<h3>{issue.name}</h3>
									</div>
									<div className="issue-header-info">
										<div>
											Published:{' '}
											<span>{formatDate(issue.createdAt)}</span>
										</div>
										<div>
											Author:{' '}
											<span>@{issue.researcherUsername}</span>
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
						))
					: ''}
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
