import { type FC, useEffect, useState } from 'react';
import {
  BugIcon,
  ExecutiveSummaryIcon,
  PageLoader,
  RiskScore,
  GlobeWebIcon,
  DownloadIcon,
} from '../..';
import { TableWithoutActions } from '@table/TableWithoutActions';
import {
  type ReportIssues,
  addPrintAttributesFromBody,
  formatDate,
  issuesColumnsWithoutActionAuthor,
  removePrintAttributesFromBody,
  useIssueReport,
  useReportStore,
  type IssuesShare,
} from '../../../../data';
import { RiskWithoutAction } from './components/RiskWithoutAction';
import { WebResourceScope } from './components/WebResourceScope';
import { MobileResourceScope } from './components/MobileResourceScope';
import { ReportFrontpage } from './components/ReportFrontpage';
import { ReportSectionTemplate } from './components/ReportSection';
import useTimeout from '#commonHooks/useTimeout';
import { NetworkResourceScope } from './components/NetworkResourceScope';
import { SourceScope } from './components/SourceScope';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { useUserData } from '#commonUserHooks/useUserData';

interface CustomReportProps {
  isModal?: boolean;
}

export const CustomReport: FC<CustomReportProps> = ({ isModal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { open, resourceType } = useReportStore((state: any) => state);
  const { fetchReport, resources, issues, share, resourceDomainText } = useIssueReport();
  const { getCompanyName } = useUserData();
  const { oneExecute } = useTimeout(() => window.print(), 2000);

  useEffect(() => {
    if (!resources) {
      fetchReport().finally(() => {
        if (!isModal) {
          oneExecute();
        }
        setIsLoading(false);
      });
    }
    if (!isModal && resources) {
      addPrintAttributesFromBody(resources, resourceDomainText);
    }
    return () => {
      if (!isModal) {
        removePrintAttributesFromBody();
      }
    };
  }, [resources]);

  const ActiveScope = () => {
    if (resourceType === RESOURCE_CLASS.WEB) {
      return <WebResourceScope resources={resources || []} isLoading={isLoading} />;
    } else if (resourceType === RESOURCE_CLASS.MOBILE || resourceType === RESOURCE_CLASS.CLOUD) {
      return (
        <MobileResourceScope type={resourceType} resources={resources} isLoading={isLoading} />
      );
    } else if (resourceType == 'lan') {
      return <NetworkResourceScope resources={resources} isLoading={isLoading} />;
    } else if (resourceType == RESOURCE_CLASS.SOURCE) {
      return <SourceScope resources={resources} isLoading={isLoading} />;
    }

    return <></>;
  };

  if ((open && !isLoading) || (!isModal && !isLoading)) {
    const issuesTableRows = issues
      ? issues.map((issue: ReportIssues, i: number) => ({
          published: { value: issue.createdAt, style: 'date' },
          type: { value: issue.resourceClass, style: 'vul-class' },
          risk: { value: issue.riskLevel, style: 'vul-risk' },
          score: {
            value: <RiskScore key={issue.id + i + '-rs'} riskScore={issue.riskScore} />,
            style: 'vul-score',
          },
          issueTitle: { value: issue.name, style: 'vul-title' },
          status: { value: issue.condition, style: 'vul-condition' },
        }))
      : [];

    return (
      <div className={`issues-report ${!isModal ? 'tab' : ''}`}>
        {!isModal ? (
          <ReportFrontpage resourceDomainText={getCompanyName()} />
        ) : (
          <a className="download-pdf-btn" title="download pdf" href="/report" target="_blank">
            <DownloadIcon />
          </a>
        )}
        <ReportSectionTemplate
          isIntro
          title={
            <>
              {getCompanyName()} <span>Executive summary</span>
            </>
          }
          isTitle
          icon={<ExecutiveSummaryIcon />}
          text={
            <>
              Codefend performed a security assessment of the infrastructure {getCompanyName()}.{' '}
              <br></br>The penetration test simulated an attack from an external threat actor
              attempting to gain access to systems within {getCompanyName()}. The purpose of this
              assessment was to discover and identify vulnerabilities in {getCompanyName()}{' '}
              infrastructure and suggest methods to remediate the vulnerabilities.{' '}
              <em>
                A total of {share.total} vulnerabilities have been identified within the scope of
                the engagement
              </em>
              which are broken down by severity in the table below.
            </>
          }
          mainContent={
            <RiskWithoutAction vulnerabilityByRisk={share as IssuesShare} isLoading={isLoading} />
          }
        />

        <ReportSectionTemplate
          title="scope & assets & attack surface"
          icon={<GlobeWebIcon />}
          text="Security assessments have been conducted on the following resources. Some of these resources may have been automatically detected and added by our team members."
          isTextBreak
          mainContent={<ActiveScope />}
        />

        <ReportSectionTemplate
          title="Vulnerabilities found in the structure"
          icon={<BugIcon />}
          text="These are the vulnerabilities we have identified so far during this period."
          mainContent={
            <TableWithoutActions
              isLoading={isLoading}
              resources={issuesTableRows}
              columns={issuesColumnsWithoutActionAuthor}
              id={3}
            />
          }
        />

        {issues
          ? issues.map((issue: ReportIssues, i: number) => (
              <div key={i + '-issue'}>
                <div className="issue-header">
                  <div className="title-main issue-header-name">
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
