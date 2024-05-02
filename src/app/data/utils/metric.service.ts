import { type MemberV2, type User, type Webresources } from '..';

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
export const getCountryMetrics = (resources: any[], type: string) => {
	if (!resources) return [];
	const resourceFlat = resources
		.reduce((acc: any, resource: any) => {
			if (!resource.childs) return acc;
			return acc.concat(resource.childs);
		}, [])
		.concat(resources);
		
	const dataToUse = type === 'web' ? resourceFlat : resources;

	const countries = dataToUse.reduce((acc: any, value: any) => {
		let countryCode, countryName;

		if (type === 'lead') {
			countryCode = value.lead_pais_code || null;
			countryName = value.lead_pais || null;
		} else if (type === 'web') {
			countryCode = value.serverCountryCode || null;
			countryName = value.serverCountry || null;
		} else if (type === 'order') {
			countryCode = value.user_pais_code || null;
			countryName = value.user_pais || null;
		} else {
			countryCode = value.pais_code || null;
			countryName = value.pais || null;
		}
		if (!countryCode || countryCode === '-' || countryCode === 'unknown') {
			if (!acc['unkw']) {
				acc['unkw'] = {
					count: 1,
					country: 'unknown',
					countryCode: 'unkw',
					percentage: 1,
				};
			} else {
				acc['unkw'].count++;
			}
		} else if (acc[countryCode]) {
			acc[countryCode].count++;
		} else {
			acc[countryCode] = {
				count: 1,
				country: countryName,
				countryCode,
				percentage: 1,
			};
		}

		return acc;
	}, {});

	const total = Object.keys(countries).reduce(
		(acc, value) => acc + countries[value].count,
		0,
	);

	const data = Object.keys(countries).map((countryKey: any) => {
		return {
			...countries[countryKey],
			percentage:
				Math.round((countries[countryKey].count / total) * 100 * 10) / 10,
		};
	});

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
