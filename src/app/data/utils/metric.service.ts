import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import {
  type CompanyMetrics,
  type MemberV2,
  type NetworkMetrics,
  type User,
  type Webresource,
} from '..';

/** Compute InternalNetwork OS And Count */
const computeInternalNetworkOSAndCount = (internalNetwork: any) => {
  if (!Array.isArray(internalNetwork) || internalNetwork.length === 0) return {};

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

  const total = Object.values(metrics).reduce((acc: any, value) => value + acc, 0);
  return { total, ...metrics };
};

/** Compute Source Code metrics for source code screen */
const computeSourceCodeMetrics = (source: any) => {
  if (!Array.isArray(source) || source.length === 0) return {};

  const metrics = source.reduce((acc: any, metric: any) => {
    const code = metric.source_code;
    if (acc[code]) {
      acc[code] += 1;
    } else {
      acc[code] = 1;
    }

    return acc;
  }, {});

  const total = Object.values(metrics).reduce((acc: any, value) => value + acc, 0);
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
  let percentValue = ((parseInt(value) / parseInt(total)) * 100).toFixed() + '%';

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

  const dataToUse = type === RESOURCE_CLASS.WEB ? resourceFlat : resources;

  const countries = dataToUse.reduce((acc: any, value: any) => {
    let countryCode, countryName;

    if (type === 'lead') {
      countryCode = value.lead_pais_code || null;
      countryName = value.lead_pais || null;
    } else if (type === RESOURCE_CLASS.WEB) {
      countryCode = value.server_pais_code || null;
      countryName = value.server_pais || null;
    } else if (type === RESOURCE_CLASS.NETWORK) {
      countryCode = value.server_pais_code || null;
      countryName = value.server_pais || null;
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

  const total = Object.keys(countries).reduce((acc, value) => acc + countries[value].count, 0);

  const data = Object.keys(countries).map((countryKey: any) => {
    return {
      ...countries[countryKey],
      percentage: Math.round((countries[countryKey].count / total) * 100 * 10) / 10,
    };
  });

  return data;
};

export const getCompanyMetric = (resources: Webresource[], type: string) => {
  if (!resources) return '';

  if (type === 'domain') {
    return resources.length;
  } else if (type === 'subDomain') {
    return resources.reduce((acc: any, value: Webresource) => {
      return !value?.childs ? acc : value?.childs.length + acc;
    }, 0);
  } else if (type === 'uniqueIp') {
    const domainsAndSubDomains = resources
      .reduce((acc: any, value: Webresource) => {
        return !value?.childs ? acc : acc.concat(value?.childs);
      }, [])
      .concat(resources);

    return domainsAndSubDomains.filter(
      (resource: Webresource, index: number, arr: Webresource[]) => {
        return arr.findIndex((r: Webresource) => r.main_server === resource.main_server) === index;
      }
    ).length;
  }

  return '';
};

export const getCompanyAllMetrics = (resources: Webresource[]): CompanyMetrics => {
  if (!resources || !Array.isArray(resources)) {
    return {
      domainCount: 0,
      subDomainCount: 0,
      uniqueIpCount: 0,
    };
  }

  const domainCount = resources.length;

  const allSubDomains = resources.flatMap(resource => resource.childs ?? []);
  const subDomainCount = allSubDomains.length;

  const allResources = [...resources, ...allSubDomains];

  const uniqueIps = allResources.filter(
    (resource, index, arr) => arr.findIndex(r => r.main_server === resource.main_server) === index
  );

  return {
    domainCount,
    subDomainCount,
    uniqueIpCount: uniqueIps.length,
  };
};

export const getNetworkMetrics = (resources: any[]): NetworkMetrics => {
  if (!resources || !Array.isArray(resources)) {
    return {
      subNetworkCount: 0,
      internalIpCount: 0,
      externalIpCount: 0,
      totalIpCount: 0,
      totalInternalIps: 0,
      totalExternalIps: 0,
      totalNotUniqueIpCount: 0,
      total: 0,
    };
  }

  // Reunimos todos los recursos y subredes
  const allSubNetworks = resources.flatMap(resource => resource.childs ?? []);
  const allResources = [...resources, ...allSubNetworks];

  // IPs únicas (se puede adaptar a case-insensitive o sin espacios si hiciera falta)
  const uniqueInternalIps = allResources.filter(
    (res, index, arr) =>
      res.device_in_address &&
      arr.findIndex(r => r.device_in_address === res.device_in_address) === index
  );

  const uniqueExternalIps = allResources.filter(
    (res, index, arr) =>
      res.device_ex_address &&
      arr.findIndex(r => r.device_ex_address === res.device_ex_address) === index
  );

  // Contar todas las IPs (incluyendo duplicados)
  const totalInternalIps = allResources.filter(res => res.device_in_address).length;
  const totalExternalIps = allResources.filter(res => res.device_ex_address).length;

  const in_ip_count = uniqueInternalIps.length;
  const ex_ip_count = uniqueExternalIps.length;
  return {
    internalIpCount: in_ip_count,
    externalIpCount: ex_ip_count,
    subNetworkCount: allSubNetworks.length,
    totalIpCount: in_ip_count + ex_ip_count,
    totalInternalIps,
    totalExternalIps,
    totalNotUniqueIpCount: totalInternalIps + totalExternalIps,
    total: allResources.length,
  };
};

/** Get company country locations and metric */
export const getCompanyCountryMetrics = (companies: any[]) => {
  if (!companies || !Array.isArray(companies)) return [];

  const countries = companies.reduce((acc: any, company: any) => {
    let countryCode, countryName;

    // Obtener código y nombre del país
    countryCode = company.pais_code || null;
    countryName = company.pais || company.mercado || null;

    // Mapeo de códigos comunes
    const codeMapping: Record<string, string> = {
      AR: 'Argentina',
      US: 'United States',
      CA: 'Canada',
      NL: 'Netherlands',
      AU: 'Australia',
      BR: 'Brazil',
      GB: 'United Kingdom',
      FR: 'France',
      DE: 'Germany',
      ES: 'Spain',
      IT: 'Italy',
      RU: 'Russia',
      CN: 'China',
      IN: 'India',
      JP: 'Japan',
      ZA: 'South Africa',
      MX: 'Mexico',
    };

    // Si tenemos código, usar el mapeo
    if (countryCode && codeMapping[countryCode.toUpperCase()]) {
      countryName = codeMapping[countryCode.toUpperCase()];
      countryCode = countryCode.toUpperCase();
    }

    if (!countryName || countryName === 'unknown' || countryName === '-') {
      if (!acc['unkw']) {
        acc['unkw'] = {
          count: 1,
          country: 'Unknown',
          countryCode: 'unkw',
          percentage: 1,
        };
      } else {
        acc['unkw'].count++;
      }
    } else {
      const key = countryName;
      if (acc[key]) {
        acc[key].count++;
      } else {
        acc[key] = {
          count: 1,
          country: countryName,
          countryCode: countryCode?.toLowerCase() || 'xx',
          percentage: 1,
        };
      }
    }

    return acc;
  }, {});

  const total = Object.keys(countries).reduce((acc, value) => acc + countries[value].count, 0);

  const data = Object.keys(countries).map((countryKey: any) => {
    return {
      ...countries[countryKey],
      percentage: Math.round((countries[countryKey].count / total) * 100 * 10) / 10,
    };
  });

  return data;
};

export const MetricsService = {
  isUserChat,
  computeMemberRolesCount,
  computeSourceCodeMetrics,
  computeInternalNetworkOSAndCount,
  renderPercentage,
  getCompanyMetric,
  getCountryMetrics,
  getCompanyCountryMetrics,
  getCompanyAllMetrics,
  getNetworkMetrics,
};
