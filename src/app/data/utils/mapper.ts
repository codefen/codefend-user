import { EMPTY_SHARE } from '@/app/constants/empty';
import type {
  AllIssues,
  CloudApp,
  Company,
  IssueMessage,
  Issues,
  IssuesCondition,
  IssuesShare,
  MobileApp,
  MobileProps,
  MobileUnique,
  OneIssue,
  ReportIssues,
  ResultsVdbSearchV2,
  SourceCode,
  VdbProps,
  VdbRequestSearch,
  WebReport,
} from '..';

import { AUTO_SCAN_STATE, cleanReview, formatDate, mapEpochToDate } from '..';
import type { PreviousSearch } from '@moduleHooks/usePreviousSearch';

/** Map company api data => @interface Company   */
export const mapCompany = (source: any): Company => {
  return {
    id: source?.id || '',
    name: source?.name || '',
    web: source?.web || '',
    size: source?.size || '',
    country: source?.pais || '',
    market: source?.mercado || '',
    countryCode: source?.pais_code || '',
    countryProvince: source?.pais_provincia || '',
    countryCity: source?.pais_ciudad || '',
    address: source?.address || '',
    ownerName: source?.owner_fname || '',
    ownerLastname: source?.owner_lname || '',
    ownerRole: source?.owner_role || '',
    ownerEmail: source?.owner_email || '',
    ownerPhone: source?.owner_phone || '',
    profileMedia: source?.profile_media || '',
    orderSize: source?.profile_media || '',
    isDisabled: source?.eliminado === '1',
    createdAt: source?.creacion || '',
  };
};

/** Map issues api data => @interface Issues */
export const mapIssues = (source: any): Issues => {
  return {
    id: source.id,
    companyID: source.company_id,
    resourceClass: source.resource_class,
    resourceID: source.resource_id,
    researcherID: source.researcher_id,
    researcherUsername: source.researcher_username,
    resourceDomain: source.resource_domain,
    riskLevel: source.risk_level,
    riskScore: source.risk_score,
    name: source.name,
    condition: source.condicion,
    price: source.price,
    pricePaid: source.price_paid,
    isDisabled: source.eliminado,
    createdAt: source.creacion,
    scanId: source?.neuroscan_id || null,
    orderIdentifier: source?.order_id || null,
    source: source?.source || null,
  } as Issues;
};

export const mapReportIssues = (source: any): ReportIssues => {
  return {
    ...mapIssues(source),
    totalIssues: source?.total_issues || 0,
    content: source?.issue || '',
  };
};
/** Map issue share api data => @interface IssuesShare */
export const mapIssueShare = (source: any): IssuesShare => {
  return {
    critical: source?.issues_share?.critical || '',
    elevated: source?.issues_share?.elevated || '',
    medium: source?.issues_share?.medium || '',
    low: source?.issues_share?.low || '',
    intel: source?.issues_share?.intel || '',
    total: source?.issues_share?.total || '',
  };
};
export const mapIssueShareV2 = (source: any): IssuesShare => {
  return {
    critical: source?.issues_share?.c || '',
    elevated: source?.issues_share?.h || '',
    medium: source?.issues_share?.m || '',
    low: source?.issues_share?.l || '',
    intel: source?.issues_share?.i || '',
    total: source?.issues_share?.f || '',
  };
};

/** Map issue condition api data => @interface IssuesCondition */
export const mapIssuesCondition = (source: any): IssuesCondition => {
  return {
    total: source?.issues_condicion?.total || '',
    fixed: source?.issues_condicion?.fixed || '',
    open: source?.issues_condicion?.open || '',
  };
};

export const mapWebresourceApiToWebresource = (source: any): any => {
  return {
    id: source?.id || '',
    companyID: source?.company_id || '',
    resourceDomain: source?.resource_domain || '',
    resourceDomainDad: source?.resource_domain_dad || '',
    servers: source?.servers || '',
    mainServer: source?.main_server || '',
    serverCountry: source?.server_pais || '',
    serverCountryCode: source?.server_pais_code || '',
    serverCountryProvince: source?.server_pais_provincia || '',
    serverCountryCity: source?.server_pais_ciudad || '',
    final_issues: source?.final_issues || 0,
    isDisabled: source?.eliminado === '1',
    createdAt: source?.creacion || '',

    childs: source?.childs
      ? source.childs.map((child: any) => {
          return {
            id: child.id,
            companyID: child.company_id,
            resourceDomain: child.resource_domain,
            resourceDomainDad: child.resource_domain_dad,
            servers: child.servers,
            mainServer: child.main_server,
            serverCountry: child.server_pais,
            serverCountryCode: child.server_pais_code,
            serverCountryProvince: child.server_pais_provincia,
            serverCountryCity: child.server_pais_ciudad,
            final_issues: child?.final_issues || 0,
            isDisabled: child.eliminado === '1',
            createdAt: formatDate(child.creacion),
          };
        })
      : [],
  } as any;
};

/** Map mobile app api data => @interface MobileApp */
export const mapMobileApp = (source: any): MobileApp => {
  return {
    id: source.id || '',
    companyID: source.company_id || '',
    appOS: source.app_os || '',
    appName: source.app_name || '',
    appLink: source.app_link || '',
    appAppleSubheader: source.app_apple_subheader || '',
    appDeveloper: source.app_developer || '',
    appDesc: source.app_desc || '',
    appRank: source.app_rank || '',
    appReviews: cleanReview(source.app_reviews || ''),
    appAndroidDownloads: source.app_android_downloads || '',
    appMedia: source.app_media || '',
    final_issue: source?.final_issues || '0',
    isDisabled: source.eliminado === '1',
    createdAt: formatDate(source.creacion || ''),
  };
};

/** Map available mobile apps from api => @interface MobileProps */
export const mapMobileProps = (source: any): MobileProps => {
  return {
    error: source.error,
    available: source.disponibles ? source.disponibles.map((apps: any) => mapMobileApp(apps)) : [],
  };
};
export const mapMobileAppsArray = (source: any): MobileApp[] => {
  return source.disponibles ? source.disponibles.map((apps: any) => mapMobileApp(apps)) : [];
};

/** Map mobile one api data => @interface MobileUnique */
export const mobileUniqueProps = (source: any): MobileUnique => {
  return {
    ...mapMobileApp(source?.unico || {}),
    creds: source?.unico?.creds || [],
    issues: source?.unico?.issues ? source.unico.issues.map((issue: any) => mapIssues(issue)) : [],
    issueShare: source.unico.issues_share || EMPTY_SHARE,
    issueCondition: mapIssuesCondition(source.unico || {}),
  };
};

export const mapCloudUniqueProps = (source: any) => {
  return {
    ...mapCloudApp(source.unico),
    creds: source?.unico?.creds || [],
    issues: source?.unico?.issues ? source.unico.issues.map((issue: any) => mapIssues(issue)) : [],
    issueShare: source.unico.issues_share || EMPTY_SHARE,
    issueCondition: mapIssuesCondition(source.unico || {}),
  };
};

/** Map cloud app api data => @interface CloudApp */
export const mapCloudApp = (source: any): CloudApp => {
  return {
    id: source.id || '',
    companyID: source.company_id || '',
    appName: source.cloud_name || '',
    appDesc: source.cloud_desc || '',
    cloudProvider: source.cloud_provider || '',
    cloudFirstKey: source.cloud_llave_1 || '',
    cloudSecondKey: source.cloud_llave_2 || '',
    cloudThirdKey: source.cloud_llave_3 || '',
    appMedia: source.media || '',
    final_issue: source?.final_issues || '0',
    isDisabled: source.eliminado === '1',
    createdAt: source.creacion,
  };
};

/** Map get all issues from api => @interface AllIssues */
export const mapAllIssues = (source: any): AllIssues => {
  return {
    issues: source.issues ? source.issues.map((issue: any) => mapIssues(issue)) : [],
    issueClass: source.issues_class,
    issueShare: mapIssueShare(source),
    issueCondition: mapIssuesCondition(source),
  };
};

/** Map source code api data => @interface SourceCode */
export const mapSourceCode = (source: any): SourceCode => {
  return {
    id: source.id,
    companyID: source.company_id,
    name: source.name,
    accessLink: source.access_link,
    isPublic: source.is_public,
    sourceCode: source.source_code,
    finalIssue: source.final_issues || '0',
    isDisabled: source.eliminado === '1',
    createdAt: source.creacion,
  };
};

export const mapIssueCS = (source: any): IssueMessage => {
  return {
    id: source.id,
    companyID: source.company_id,
    issueID: source.issue_id,
    userID: source.user_id,
    userUsername: source.user_username,
    userCompany: source.user_company,
    body: source.issue_cs_body,
    isDisabled: source.eliminado === '1',
    createdAt: formatDate(source.creacion),
  };
};

export const mapOneIssue = (source: any): OneIssue => {
  return {
    company: mapCompany(source.company),
    issue: {
      ...mapIssues(source.issue),
      content: source.issue.issue,
      cs: source.issue.cs ? source.issue.cs.map((cs: any) => mapIssueCS(cs)) : null,
    },
  };
};

export const maPreviousSearch = (source: any): PreviousSearch => {
  return {
    id: source.id,
    company_id: source.company_id,
    username: source.username,
    model: source.model,
    info: source.informacion,
    ...source,
  };
};

export const mapIntelData = (source: any) => {
  return {
    ...source,
    preview: '',
  };
};

export const mapVdbRequestSearch = (source: any): VdbRequestSearch => {
  return {
    ...source,
    apiKey: source.apikey,
    userID: source.userid,
  };
};

export const mapVdbResults = (source: any) => {
  return {
    ...source,
    advisory: {
      date: mapEpochToDate(source.advisory.date),
    },
  };
};

export const mapVdbSearch = (source: any): VdbProps => {
  return {
    response: source.response,
    request: mapVdbRequestSearch(source.request),
    result: source.result.map((result: any) => mapVdbResults(result)),
  };
};

export const mapVdbResultV2 = (source: any): ResultsVdbSearchV2 => {
  return {
    id: source.id,
    entryID: source.entry_id,
    title: source.title,
    vulnerability: source.vulnerability,
    riskScore: source.risk_value,
    riskName: source.risk_name,
    type: source.class,
    createdAt: mapEpochToDate(source.timestamp_create),
    updatedAt: mapEpochToDate(source.timestamp_change),
  };
};

export const mapWebReportResources = (source: any): WebReport => {
  return {
    resources: [mapWebresourceApiToWebresource(source.resource)],
    issues: source.issues
      ? source.issues.map((issue: any) => mapReportIssues(issue))
      : ([] as ReportIssues[]),
    issueShare: source.issues_share ? mapIssueShare(source) : ({} as IssuesShare),
  };
};

export const mapScanObjToScanFinishedObj = (scan: any): any => ({
  scanProgress: 100,
  webScanProgress: 100,
  leaksScanProgress: 100,
  subdomainScanProgress: 100,
  status: AUTO_SCAN_STATE.SCAN_FINISHED,
  phase: scan.phase,
  m_nllm_issues_found: scan?.m_nllm_issues_found,
  m_nllm_issues_parsed: scan?.m_nllm_issues_parsed,
  m_nllm_phase: scan?.m_nllm_phase,
  m_nllm_finished: scan?.m_nllm_finished,
  m_nllm_launched: scan?.m_nllm_launched,
  m_nllm_parser_finished: scan?.m_nllm_parser_finished,
  m_nllm_scanner_finished: scan?.m_nllm_scanner_finished,
  m_nllm_scanner_launched: scan?.m_nllm_scanner_launched,
  m_leaks_launched: scan?.m_leaks_launched,
  m_leaks_finished: scan?.m_leaks_finished,
  m_leaks_phase: scan?.m_leaks_phase,
  m_leaks_social_found: scan?.m_leaks_social_found,
  m_leaks_found: scan?.m_leaks_found,
  m_subdomains_launched: scan?.m_subdomains_launched,
  m_subdomains_finished: scan?.m_subdomains_finished,
  m_subdomains_found: scan?.m_subdomains_found,
  m_subdomains_found_servers: scan?.m_subdomains_found_servers,
  resource_address: scan?.resource_address,
  resource_class: scan?.resource_class,
  resource_id: scan?.resource_id,
  user_email: scan?.user_email,
  launched: scan?.launched,
});

export const mapScanObjToScanStartedScanObj = (scan: any): any => ({
  scanProgress: 0,
  webScanProgress: 0,
  leaksScanProgress: 0,
  subdomainScanProgress: 0,
  status: AUTO_SCAN_STATE.SCAN_LAUNCHED,
  phase: scan.phase,
  m_nllm_issues_found: scan?.m_nllm_issues_found,
  m_nllm_issues_parsed: scan?.m_nllm_issues_parsed,
  m_nllm_phase: scan?.m_nllm_phase,
  m_nllm_finished: scan?.m_nllm_finished,
  m_nllm_launched: scan?.m_nllm_launched,
  m_nllm_parser_finished: scan?.m_nllm_parser_finished,
  m_nllm_scanner_finished: scan?.m_nllm_scanner_finished,
  m_nllm_scanner_launched: scan?.m_nllm_scanner_launched,
  m_leaks_launched: scan?.m_leaks_launched,
  m_leaks_finished: scan?.m_leaks_finished,
  m_leaks_phase: scan?.m_leaks_phase,
  m_leaks_social_found: scan?.m_leaks_social_found,
  m_leaks_found: scan?.m_leaks_found,
  m_subdomains_launched: scan?.m_subdomains_launched,
  m_subdomains_finished: scan?.m_subdomains_finished,
  m_subdomains_found: scan?.m_subdomains_found,
  m_subdomains_found_servers: scan?.m_subdomains_found_servers,
  resource_address: scan?.resource_address,
  resource_class: scan?.resource_class,
  resource_id: scan?.resource_id,
  user_email: scan?.user_email,
  launched: scan?.launched,
});
