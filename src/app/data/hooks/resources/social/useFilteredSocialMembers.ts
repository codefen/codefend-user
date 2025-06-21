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
      return (
        filters.resource_domain.length === 0 ||
        (member.resource_domain && filters.resource_domain.includes(member.resource_domain))
      );
    });

    return { filteredData, isFiltered: true };
  }, [members, filters]);
}; 