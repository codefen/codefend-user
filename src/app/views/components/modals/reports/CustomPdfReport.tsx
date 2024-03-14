import React, { useMemo } from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { BugIcon, LocationItem, RiskScore } from '../..';
import { TableWithoutActions } from '../../Table/TableWithoutActions';
import {
	IssuesShare,
	ReportIssues,
	Resouce,
	WebReport,
	Webresources,
	cleanHTML,
	formatDate,
	issuesColumnsWithoutAction,
	webResourcesWithoutActions,
} from '../../../../data';
import { RiskWithoutAction } from './components/RiskWithoutAction';

interface CustomReportProps {
	report: WebReport;
	isLoading: boolean;
}

export const CustomPdfReport = ({ report, isLoading }: CustomReportProps) => {
	const resource = report?.resources?.[0];
	const resourceDomainText = resource
		? resource.resourceDomain || '. . .'
		: '. . .';

	const scopeDataTable = report.resources.map(
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

	const vulnerabilityDataTable = report.issues.map(
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
		<Document
			author="codefend"
			creator="codefend"
			producer="codefend"
			creationDate={new Date()}
			language="English">
			<Page size="A4" wrap>
				<View
					style={{
						position: 'relative',
						padding: '20px',
						fontSize: '20px',
					}}
					id="issue-web-report">
					<View
						style={{
							textTransform: 'uppercase',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							rowGap: '15px',
							marginTop: '40px',
							marginBottom: '20px',
							color: '#e84f4f',
						}}>
						<BugIcon />
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '16px',
								flex: '1 1',
								paddingLeft: '12px',
								color: '#222222',
							}}>
							{resourceDomainText} Executive summary
						</Text>
					</View>

					<Text
						style={{
							fontSize: '15px',
							lineHeight: '1.6',
							marginTop: '16px',
							marginBottom: '16px',
						}}
						break>
						Our Red Team performed a security assessment of the internal
						corporate network of {resourceDomainText}. The penetration
						test simulated an attack from an external threat actor
						attempting to gain access to systems within Fractal corporate
						network. The purpose of this assessment was to discover and
						identify vulnerabilities in {resourceDomainText}
						infrastructure and suggest methods to remediate the
						vulnerabilities.{' '}
						<Text
							style={{
								fontSize: '15px',
								lineHeight: '1.6',
								fontStyle: 'normal',
								color: '#b21c1c',
								padding: '5px',
							}}>
							A total of "issues_share" vulnerabilities have been
							identified within the scope of the engagement
						</Text>{' '}
						which are broken down by severity in the table below.
					</Text>
					<View>
						<RiskWithoutAction
							vulnerabilityByRisk={
								report?.issueShare || ({} as IssuesShare)
							}
							isLoading={false}
						/>
					</View>

					<View />

					<View
						style={{
							textTransform: 'uppercase',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							rowGap: '15px',
							marginTop: '40px',
							marginBottom: '20px',
							color: '#e84f4f',
						}}>
						<BugIcon />
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '16px',
								flex: '1 1',
								paddingLeft: '12px',
								color: '#222222',
							}}>
							scope & assets & attack surface
						</Text>
					</View>

					<Text
						style={{
							fontSize: '15px',
							lineHeight: '1.6',
							marginTop: '16px',
							marginBottom: '16px',
						}}
						break>
						Security assessments were conducted within the following
						located resources. Several of these resources were
						automatically detected and added by our staff and software and
						may not contain regular content.
					</Text>

					<TableWithoutActions
						columns={webResourcesWithoutActions}
						resources={scopeDataTable}
						isLoading={isLoading}
						id={2}
						needMarker
					/>

					<View />

					<View
						style={{
							textTransform: 'uppercase',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							rowGap: '15px',
							marginTop: '40px',
							marginBottom: '20px',
							color: '#e84f4f',
						}}>
						<BugIcon />
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '16px',
								flex: '1 1',
								paddingLeft: '12px',
								color: '#222222',
							}}>
							Vulnerabilities found in the structure
						</Text>
					</View>
					<Text
						style={{
							fontSize: '15px',
							lineHeight: '1.6',
							marginTop: '16px',
							marginBottom: '16px',
						}}
						break>
						The highest severity vulnerabilities give potential attackers
						the opportunity to completely take over user accounts from the
						client with the corresponding risks. In order to ensure data
						confidentiality, integrity, and availability, security
						remediations should be implemented as described in the
						security assessment findings.
					</Text>

					<TableWithoutActions
						isLoading={isLoading}
						resources={vulnerabilityDataTable}
						columns={issuesColumnsWithoutAction}
						id={3}
					/>

					<View />

					<View
						style={{
							textTransform: 'uppercase',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							rowGap: '15px',
							marginTop: '40px',
							marginBottom: '20px',
							color: '#e84f4f',
						}}>
						<BugIcon />
						<Text
							style={{
								fontSize: '16px',
								lineHeight: '16px',
								flex: '1 1',
								paddingLeft: '12px',
								color: '#222222',
							}}>
							scope & assets & attack surface
						</Text>
					</View>
					<Text
						style={{
							fontSize: '15px',
							lineHeight: '1.6',
							marginTop: '16px',
							marginBottom: '16px',
						}}
						break>
						Security assessments were conducted within the following
						located resources. Several of these resources were
						automatically detected and added by our staff and software and
						may not contain regular content.
					</Text>

					{report.issues.map((issue: ReportIssues, i: number) => (
						<View key={i + '-issue-pdf'}>
							<View
								style={{
									display: 'flex',
									flexDirection: 'column',
									flex: '1 1',
								}}>
								<View
									style={{
										textTransform: 'uppercase',
										height: '30px',
										display: 'flex',
										alignItems: 'center',
										rowGap: '15px',
										marginTop: '40px',
										marginBottom: '20px',
										color: '#e84f4f',
									}}>
									<BugIcon />
									<Text
										style={{
											fontSize: '15px',
											flex: '1 1',
											paddingLeft: '12px',
											color: '#222222',
										}}>
										{issue.name}
									</Text>
								</View>
								<View
									style={{
										display: 'flex',
										alignItems: 'stretch',
										textTransform: 'uppercase',
										fontSize: '0.89rem',
										height: '40px',
										columnGap: '3rem',
										color: '#cb2222',
									}}>
									<View>
										Published:{' '}
										<Text style={{ color: '#222222' }}>
											{formatDate(issue.createdAt)}
										</Text>
									</View>
									<View>
										Author:{' '}
										<Text style={{ color: '#222222' }}>
											@{issue.researcherUsername}
										</Text>
									</View>
									<View>
										Risk score:{' '}
										<Text style={{ color: '#222222' }}>
											{issue.riskScore}
										</Text>
									</View>
									<View>
										Severity:{' '}
										<Text style={{ color: '#222222' }}>
											{issue.riskLevel}
										</Text>
									</View>
									<View>
										Status:{' '}
										<Text style={{ color: '#222222' }}>
											{issue.condition}
										</Text>
									</View>
								</View>
							</View>
							<View>{cleanHTML(issue.content)}</View>
						</View>
					))}
				</View>
			</Page>
		</Document>
	);
};
