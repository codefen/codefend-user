import type { FilterState } from '@interfaces/issues';
import { ResourcesTypes } from '@interfaces/order';
import type { Issues } from '@interfaces/panel';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export const useFiltersWithURL = (issues: Issues[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    resourceClass: [],
    scanId: [],
    orderIdentifier: [],
    riskScore: [],
  });

  const handleFilters = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentFilters = prev[filterType];
      const isRemoving = currentFilters.includes(value);
      const updated = isRemoving
        ? currentFilters.filter(filter => filter !== value)
        : [...currentFilters, value];

      // Get current URL parameters
      const currentParams = Object.fromEntries(searchParams.entries());

      // If we're selecting a scan ID, ensure only web resource type is selected
      if (filterType === 'scanId') {
        if (isRemoving) {
          // Remove scan_id from URL when unchecking
          delete currentParams['scan_id'];
        } else {
          // Add scan_id to URL when checking
          currentParams['scan_id'] = value;
        }
        setSearchParams(currentParams);
        return {
          ...prev,
          [filterType]: updated,
        };
      }

      // If we're selecting a resource type
      if (filterType === 'resourceClass') {
        if (isRemoving) {
          // If unchecking web resource type, also remove scan_id
          if (value === ResourcesTypes.WEB) {
            delete currentParams['scan_id'];
          }
          // Update resourceClass in URL
          const newResourceClass = prev.resourceClass.filter(r => r !== value);
          if (newResourceClass.length > 0) {
            currentParams['resourceClass'] = newResourceClass.join(',');
          } else {
            delete currentParams['resourceClass'];
          }
        } else {
          // If selecting a non-WEB resource type, remove scan_id
          if (value !== ResourcesTypes.WEB) {
            delete currentParams['scan_id'];
          }
          // Add new resource type to URL
          const newResourceClass = [...prev.resourceClass, value];
          currentParams['resourceClass'] = newResourceClass.join(',');
        }
        setSearchParams(currentParams);
        return {
          ...prev,
          [filterType]: updated,
          // If selecting non-WEB or unchecking WEB, clear scan IDs
          scanId: value !== ResourcesTypes.WEB || isRemoving ? [] : prev.scanId,
        };
      }

      // Handle other filter types (riskScore, orderIdentifier)
      if (!isRemoving) {
        // Add new filter to URL
        const currentValues = currentParams[filterType] ? currentParams[filterType].split(',') : [];
        currentValues.push(value);
        currentParams[filterType] = currentValues.join(',');
      } else {
        // Remove filter from URL
        const currentValues = currentParams[filterType] ? currentParams[filterType].split(',') : [];
        const newValues = currentValues.filter(v => v !== value);
        if (newValues.length > 0) {
          currentParams[filterType] = newValues.join(',');
        } else {
          delete currentParams[filterType];
        }
      }
      setSearchParams(currentParams);

      return {
        ...prev,
        [filterType]: updated,
      };
    });
  };

  // Handle URL parameters for filtering
  useEffect(() => {
    if (issues.length === 0) return;

    const scanId = searchParams.get('scan_id');
    const resourceClass = searchParams.get('resourceClass');
    const orderIdentifier = searchParams.get('orderIdentifier');
    const riskScore = searchParams.get('riskScore');

    setFilters(prev => {
      const newFilters = { ...prev };

      if (scanId) {
        const hasMatchingIssue = issues.some(issue => issue.scanId === scanId);
        if (hasMatchingIssue) {
          newFilters.scanId = [scanId];
        } else {
          console.warn(`No issues found with scan_id: ${scanId}`);
        }
      }

      if (resourceClass) {
        const resourceClasses = resourceClass.split(',');
        // If there's a non-WEB resource type, remove scan_id
        if (resourceClasses.some(r => r !== ResourcesTypes.WEB)) {
          newFilters.scanId = [];
        }
        newFilters.resourceClass = resourceClasses;
      }

      if (orderIdentifier) {
        newFilters.orderIdentifier = orderIdentifier.split(',');
      }

      if (riskScore) {
        newFilters.riskScore = riskScore.split(',');
      }

      return newFilters;
    });
  }, [searchParams, issues]);

  return { filters, handleFilters };
};
