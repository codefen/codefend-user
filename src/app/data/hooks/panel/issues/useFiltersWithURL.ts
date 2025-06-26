import type { FilterState } from '@interfaces/issues';
import { ResourcesTypes } from '@interfaces/order';
import type { Issues } from '@interfaces/panel';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const useFiltersWithURL = (issues: Issues[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    resourceClass: [],
    scanId: [],
    orderIdentifier: [],
    riskScore: [],
  });

  // Track if we're in the middle of a programmatic update to prevent loops
  const isUpdatingProgrammatically = useRef(false);

  // URL parameter mapping - memoized for performance
  const urlParamMap: Record<keyof FilterState, string> = useMemo(
    () => ({
      scanId: 'scan_id',
      resourceClass: 'resourceClass',
      orderIdentifier: 'orderIdentifier',
      riskScore: 'riskScore',
    }),
    []
  );

  // Parse URL parameters into filter state
  const parseUrlToFilters = useCallback((searchParams: URLSearchParams): FilterState => {
    const scanId = searchParams.get('scan_id');
    const resourceClass = searchParams.get('resourceClass');
    const orderIdentifier = searchParams.get('orderIdentifier');
    const riskScore = searchParams.get('riskScore');

    return {
      scanId: scanId ? scanId.split(',').filter(Boolean) : [],
      resourceClass: resourceClass ? resourceClass.split(',').filter(Boolean) : [],
      orderIdentifier: orderIdentifier ? orderIdentifier.split(',').filter(Boolean) : [],
      riskScore: riskScore ? riskScore.split(',').filter(Boolean) : [],
    };
  }, []);

  const validateFilters = useCallback(
    (filters: FilterState): FilterState => {
      if (issues.length === 0) return filters;

      const validScanIds = filters.scanId.filter(id => issues.some(issue => issue.scanId === id));

      if (validScanIds.length !== filters.scanId.length) {
        console.warn(`Some scan_ids not found in issues: ${filters.scanId.join(',')}`);
      }

      return {
        ...filters,
        scanId: validScanIds,
      };
    },
    [issues]
  );

  const areFiltersEqual = useCallback((a: FilterState, b: FilterState): boolean => {
    return (
      a.scanId.length === b.scanId.length &&
      a.resourceClass.length === b.resourceClass.length &&
      a.orderIdentifier.length === b.orderIdentifier.length &&
      a.riskScore.length === b.riskScore.length &&
      a.scanId.every((item, index) => item === b.scanId[index]) &&
      a.resourceClass.every((item, index) => item === b.resourceClass[index]) &&
      a.orderIdentifier.every((item, index) => item === b.orderIdentifier[index]) &&
      a.riskScore.every((item, index) => item === b.riskScore[index])
    );
  }, []);

  const updateUrlFromFilters = useCallback(
    (newFilters: FilterState) => {
      setSearchParams(currentParams => {
        const newParams = new URLSearchParams(currentParams);
        Object.entries(urlParamMap).forEach(([filterKey, urlKey]) => {
          const filterValues = newFilters[filterKey as keyof FilterState];

          if (filterValues.length > 0) {
            newParams.set(urlKey, filterValues.join(','));
          } else {
            newParams.delete(urlKey);
          }
        });
        // console.log('URL Update:', {
        //   from: currentParams.toString(),
        //   to: newParams.toString(),
        //   filters: newFilters,
        // });
        return newParams;
      });
    },
    [urlParamMap, setSearchParams]
  );

  const handleFilters = useCallback(
    (filterType: keyof FilterState, value: string) => {
      // console.log('handleFilters called:', {
      //   filterType,
      //   value,
      //   currentFilters: filters[filterType],
      // });
      isUpdatingProgrammatically.current = true;

      setFilters(prevFilters => {
        const currentFilters = prevFilters[filterType];
        const isRemoving = currentFilters.includes(value);
        const updatedFilters = isRemoving
          ? currentFilters.filter(filter => filter !== value)
          : [...currentFilters, value];

        const newFilters = {
          ...prevFilters,
          [filterType]: updatedFilters,
        };

        // console.log('Filter state update:', {
        //   filterType,
        //   value,
        //   isRemoving,
        //   previousFilters: prevFilters,
        //   newFilters,
        // });

        // Usa queueMicrotask para mejor performance que setTimeout
        queueMicrotask(() => {
          updateUrlFromFilters(newFilters);
          // Re activa la sincronización de URL después de que la actualización de URL se complete
          queueMicrotask(() => {
            isUpdatingProgrammatically.current = false;
          });
        });

        return newFilters;
      });
    },
    [filters, updateUrlFromFilters]
  );

  useEffect(() => {
    // Skip if we're updating programmatically or no issues loaded
    if (isUpdatingProgrammatically.current || issues.length === 0) {
      // console.log('URL sync skipped:', {
      //   isUpdatingProgrammatically: isUpdatingProgrammatically.current,
      //   issuesCount: issues.length,
      // });
      return;
    }

    const urlFilters = parseUrlToFilters(searchParams);
    const validatedFilters = validateFilters(urlFilters);

    // Solo se actualiza si los filtros son diferentes
    if (!areFiltersEqual(filters, validatedFilters)) {
      // console.log('URL sync - Updating filters from URL:', {
      //   urlParams: Object.fromEntries(searchParams.entries()),
      //   parsedFilters: urlFilters,
      //   validatedFilters,
      //   currentFilters: filters,
      // });
      setFilters(validatedFilters);
    }
  }, [searchParams, issues, filters, parseUrlToFilters, validateFilters, areFiltersEqual]);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (issues.length > 0) {
      const urlFilters = parseUrlToFilters(searchParams);
      const validatedFilters = validateFilters(urlFilters);
      const hasFilters = Object.values(validatedFilters).some(arr => arr.length > 0);

      if (hasFilters && !areFiltersEqual(filters, validatedFilters)) {
        // console.log('Initial URL sync:', validatedFilters);
        setFilters(validatedFilters);
      }
    }
  }, [issues.length]);

  return {
    filters,
    handleFilters,
    // __debug: {
    //   isUpdatingProgrammatically: isUpdatingProgrammatically.current,
    //   parseUrlToFilters,
    //   validateFilters,
    //   areFiltersEqual,
    //   currentURL: searchParams.toString(),
    // },
  };
};
