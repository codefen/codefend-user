import type { FilterState } from '@interfaces/issues';
import type { Issues } from '@interfaces/panel';
import { useMemo } from 'react';

export const useFilteredIssues = (issues: Issues[], filters: FilterState) => {
  return useMemo(() => {
    const isFiltered = Object.values(filters).some(arr => arr.length > 0);

    if (!isFiltered) {
      return { filteredData: issues, isFiltered: false };
    }

    const filteredData = issues.filter(issue => {
      return (
        (filters.resourceClass.length === 0 ||
          filters.resourceClass.includes(issue.resourceClass)) &&
        (filters.scanId.length === 0 || filters.scanId.includes(issue.scanId)) &&
        (filters.orderIdentifier.length === 0 ||
          filters.orderIdentifier.includes(issue.orderIdentifier)) &&
        (filters.riskScore.length === 0 || filters.riskScore.includes(issue.riskScore))
      );
    });

    return { filteredData, isFiltered: true };
  }, [issues, filters]);
};
