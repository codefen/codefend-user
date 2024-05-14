import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
	mapIssueShareV2,
	mapMobileApp,
	mapWebresourceApiToWebresource,
	mapCloudApp,
	mapReportIssues,
} from '../../..';
import { useReportStore } from '../../../';
import { useUserData } from '#commonUserHooks/useUserData';
import { useFetcher } from '#commonHooks/useFetcher';
import { companyIdIsNotNull } from '@/app/constants/validations';

export const useIssueReport = () => {
	const resources = useRef<any>(null);
	const issues = useRef<any>(null);
	const [share, setShare] = useState<any>(null);
	const [resourceDomainText, setDomainText] = useState('');
	const [fetcher] = useFetcher();

	const { getCompany } = useUserData();
	const { resourceID, resourceType } = useReportStore((state) => state);

	const getReport = (
		companyID: string,
		issueID: string,
		resourceType: string,
	) => {
		return fetcher('post', {
			body: {
				model: 'issues/inform',
				company_id: companyID,
				resource_id: issueID,
				resource_class: resourceType,
			},
		}).then(({ data }: any) => {
			issues.current = data.issues
				? data.issues.map((issue: any) => mapReportIssues(issue))
				: [];

			setShare(mapIssueShareV2(data));

			if (resourceType === 'web') {
				resources.current = [mapWebresourceApiToWebresource(data.resource)];
			} else if (resourceType === 'mobile') {
				resources.current = mapMobileApp(data.resource);
			} else if (resourceType === 'cloud') {
				resources.current = mapCloudApp(data.resource);
			} else if (resourceType === 'lan') {
				resources.current = [data.resource];
			} else if (resourceType === 'source' || resourceType === 'social') {
				resources.current = data?.resource || {};
			}

			if (resources.current) {
				if (resourceType === 'web') {
					setDomainText(resources.current[0].resourceDomain);
				} else if (resourceType === 'mobile' || resourceType === 'cloud') {
					setDomainText(resources.current.appName);
				} else if (resourceType === 'lan') {
					setDomainText(resources.current[0].device_ex_address);
				} else if (resourceType === 'source') {
					setDomainText(resources.current.name);
				} else if (resourceType === 'social') {
					//setDomainText(`${resources.current.member_fname}  ${resources.current.member_lname}`);
					setDomainText(`Some Name`);
				}
			}

			return data;
		});
	};

	const fetchReport = () => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return Promise.resolve(false);

		return getReport(companyID, resourceID, resourceType);
	};

	return {
		fetchReport,
		resourceDomainText,
		resources: resources.current,
		issues: issues.current,
		share,
	};
};
