import { useMemo } from 'react';
import type { MemberV2 } from '@interfaces/panel';
import type { SocialFilterState } from './useSocialFilters';

export const useFilteredSocialMembers = (
  members: MemberV2[],
  filters: SocialFilterState
) => {
  return useMemo(() => {
    const isFiltered = Object.values(filters).some(arr => arr.length > 0);

    if (!isFiltered) {
      return { filteredData: members, isFiltered: false };
    }

    const filteredData = members.filter(member => {
      const domainMatch =
        filters.resource_domain.length === 0 ||
        (member.resource_domain &&
          filters.resource_domain.includes(member.resource_domain));

      const propertiesMatch =
        filters.properties.length === 0 ||
        filters.properties.every(property => {
          if (property === 'has_name') {
            return !!member.name;
          }
          if (property === 'has_linkedin') {
            return !!member.linkedin_url;
          }
          return true;
        });

      return domainMatch && propertiesMatch;
    });

    return { filteredData, isFiltered: true };
  }, [members, filters]);
}; 