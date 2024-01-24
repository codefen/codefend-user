import { MemberV2, User, Webresources } from '..';

/** Compute InternalNetwork OS And Count */
const computeInternalNetworkOSAndCount = (internalNetwork: any) => {
	if (!Array.isArray(internalNetwork) || internalNetwork.length === 0)
		return {};

	const metrics = internalNetwork.reduce((acc, item) => {
		const osType = item.device_os;
		const childs = item.childs;

		if (childs && childs.length !== 0) {
			childs.map((child: any) => {
				const childOsType = child.device_os;
				if (acc[childOsType]) {
					acc[childOsType] += 1;
				} else {
					acc[childOsType] = 1;
				}
			});
		}

		if (acc[osType]) {
			acc[osType] += 1;
		} else {
			acc[osType] = 1;
		}

		return acc;
	}, {});

	const total = Object.values(metrics).reduce(
		(acc: any, value) => value + acc,
		0,
	);
	return { total, ...metrics };
};

/** Compute Source Code metrics for source code screen */
const computeSourceCodeMetrics = (source: any) => {
	if (!Array.isArray(source) || source.length === 0) return {};

	const metrics = source.reduce((acc: any, metric: any) => {
		const code = metric.sourceCode;
		if (acc[code]) {
			acc[code] += 1;
		} else {
			acc[code] = 1;
		}

		return acc;
	}, {});

	const total = Object.values(metrics).reduce(
		(acc: any, value) => value + acc,
		0,
	);
	return { total, ...metrics };
};

/** verify if auth User Chat */
const isUserChat = (id: any, user: User | null) => {
	if (!id) return false;
	if (!user) return false;

	const userId = user.id;
	return userId === id;
};

/** compute social roles */
const computeMemberRolesCount = (members: MemberV2[] = []): any => {
	if (!members) return [];
	return members.reduce((rolesCount: any, member: MemberV2) => {
		const { member_role } = member;
		rolesCount[member_role] = (rolesCount[member_role] || 0) + 1;
		return rolesCount;
	}, {});
};

const renderPercentage = (value: string, total: string) => {
	if (value === '0') {
		return '0%';
	}
	let percentValue =
		((parseInt(value) / parseInt(total)) * 100).toFixed() + '%';

	return percentValue;
};

/** Get resources  country locations and metric */
export const getCountryMetrics = (resources: Webresources[]) => {
	if (!resources) return [];

	const domainsAndSubDomains = resources
		.reduce((acc: any, resource: Webresources) => {
			return resource.childs === null ? acc : acc.concat(resource.childs);
		}, [])
		.concat(resources);

	//console.log('domainsAndSubDomains', { domainsAndSubDomains });

	const countries = domainsAndSubDomains.reduce((acc: any, value: any) => {
		if (!value.serverCountryCode || value.serverCountryCode === '-')
			return acc;
		if (acc[value.serverCountryCode]) {
			acc[value.serverCountryCode].count++;
			return acc;
		} else {
			acc[value.serverCountryCode] = {
				count: 1,
				country: value.serverCountry,
				countryCode: value.serverCountryCode,
				percentage: 1,
			};

			return acc;
		}
	}, {});

	//console.log('countries', { countries });

	const total = Object.keys(countries).reduce(
		(acc, value) => acc + countries[value].count,
		0,
	);

	//console.log('total', { total });

	const data = Object.keys(countries).map((countryKey: any) => {
		return {
			...countries[countryKey],
			percentage:
				Math.round((countries[countryKey].count / total) * 100 * 10) / 10,
		};
	});

	//console.log('metrics', { data });
	return data;
};

export const getCompanyMetric = (resources: Webresources[], type: string) => {
	if (!resources) return '';

	if (type === 'domain') {
		return resources.length;
	} else if (type === 'subDomain') {
		return resources.reduce((acc: any, value: Webresources) => {
			return value.childs === null ? acc : value.childs.length + acc;
		}, 0);
	} else if (type === 'uniqueIp') {
		const domainsAndSubDomains = resources
			.reduce((acc: any, value: Webresources) => {
				return value.childs === null ? acc : acc.concat(value.childs);
			}, [])
			.concat(resources);

		return domainsAndSubDomains.filter(
			(resource: any, index: any, arr: any) => {
				return (
					arr.findIndex(
						(r: any) => r.mainServer === resource.mainServer,
					) === index
				);
			},
		).length;
	}

	return '';
};

export const MetricsService = {
	isUserChat,
	computeMemberRolesCount,
	computeSourceCodeMetrics,
	computeInternalNetworkOSAndCount,
	renderPercentage,
	getCompanyMetric,
	getCountryMetrics,
};
