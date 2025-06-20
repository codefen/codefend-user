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
          // Remove specific scan_id from URL when unchecking
          const currentScanIds = currentParams['scan_id']
            ? currentParams['scan_id'].split(',')
            : [];
          const newScanIds = currentScanIds.filter(id => id !== value);
          if (newScanIds.length > 0) {
            currentParams['scan_id'] = newScanIds.join(',');
          } else {
            delete currentParams['scan_id'];
          }
        } else {
          // Add scan_id to URL when checking
          const currentScanIds = currentParams['scan_id']
            ? currentParams['scan_id'].split(',')
            : [];
          currentScanIds.push(value);
          currentParams['scan_id'] = currentScanIds.join(',');
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
          // Update resourceClass in URL
          const newResourceClass = prev.resourceClass.filter(r => r !== value);
          if (newResourceClass.length > 0) {
            currentParams['resourceClass'] = newResourceClass.join(',');
          } else {
            delete currentParams['resourceClass'];
          }
        } else {
          // Add new resource type to URL
          const newResourceClass = [...prev.resourceClass, value];
          currentParams['resourceClass'] = newResourceClass.join(',');
        }
        setSearchParams(currentParams);
        return {
          ...prev,
          [filterType]: updated,
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
        const scanIds = scanId.split(',');
        const validScanIds = scanIds.filter(id => issues.some(issue => issue.scanId === id));
        if (validScanIds.length > 0) {
          newFilters.scanId = validScanIds;
        } else {
          console.warn(`No issues found with any of the scan_ids: ${scanId}`);
        }
      }

      if (resourceClass) {
        const resourceClasses = resourceClass.split(',');
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
