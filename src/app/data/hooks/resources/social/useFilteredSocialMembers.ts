import { useMemo } from 'react';
import type { MemberV2 } from '@interfaces/panel';
import type { SocialFilterState } from './useSocialFilters';

export const useFilteredSocialMembers = (
  members: MemberV2[],
  filters: SocialFilterState,
) => {
  return useMemo(() => {
    const isFiltered = Object.values(filters).some(arr => arr.length > 0);

    if (!isFiltered) {
      return { filteredData: members, isFiltered: false };
    }

    const filteredData = members.filter(member => {
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

      return propertiesMatch;
    });

    return { filteredData, isFiltered: true };
  }, [members, filters]);
}; 