import React, { useEffect, lazy, useRef, useState } from 'react';
import {
	BugIcon,
	ExecutiveSummaryIcon,
	PageLoader,
	RiskScore,
	GlobeWebIcon,
	AimIcon,
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
					share.current = mapIssueShare(response);

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
		if (!isModal) {
			return (
				<div className="issues-report tab">
					<div className="portada">
						<div className="codefend-header">
							<div className="date">
								<span>{resourceDomainText}</span> - {getCurrentDate()}
							</div>
							<Logo theme="light" />
						</div>
						<div className="aim">
							<AimIcon />
							<h2>CONFIDENTIAL</h2>
						</div>
						<div className="title-portada">
							<ExecutiveSummaryIcon />
							<p>
								This penetration test on {resourceDomainText} was
								requested by <span>[company]</span> and conducted by
								Codefend.
							</p>
						</div>
					</div>

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
								<br></br>The penetration test simulated an attack from
								an external threat actor attempting to gain access to
								systems within Fractal corporate network. The purpose of
								this assessment was to discover and identify
								vulnerabilities in {resourceDomainText}
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
									isLoading={false}
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
								automatically detected and added by our staff and
								software and may not contain regular content.
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
								accounts from the client with the corresponding risks.
								In order to ensure data confidentiality, integrity, and
								availability, security remediations should be
								implemented as described in the security assessment
								findings.
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
		}
		return (
			<div className={`issues-report ${!isModal ? 'tab' : ''}`}>
				<a
					className="download-pdf-btn"
					title="download pdf"
					href="/report"
					target="_blank">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
						/>
					</svg>
				</a>
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
								isLoading={false}
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
