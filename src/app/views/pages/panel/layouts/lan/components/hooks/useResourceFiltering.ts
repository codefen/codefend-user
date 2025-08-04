import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { flattenRows } from '@utils/sort.service.ts';
import type { Device } from '@interfaces/panel.ts';

// Extended interface for network resources
interface NetworkDevice extends Device {
  all_found_domains?: string;
  all_found_domains_value?: string;
  server_pais?: string;
  server_pais_code?: string;
  server_pais_provincia?: string;
  server_pais_ciudad?: string;
  device_class?: string;
  neuroscan_id?: string;
  neuroscan_main_domain?: string;
  source?: string;
}

export interface UseResourceFilteringOptions {
  resources: NetworkDevice[];
  debounceMs?: number;
}

export interface UseResourceFilteringReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredResources: NetworkDevice[];
  isSearching: boolean;
  totalCount: number;
  filteredCount: number;
}

/**
 * Custom hook for resource filtering with optimized search and debouncing
 */
export const useResourceFiltering = ({
  resources,
  debounceMs = 300,
}: UseResourceFilteringOptions): UseResourceFilteringReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Flatten and prepare resources with memoization
  const flattenedResources = useMemo(() => {
    return flattenRows(resources, 0);
  }, [resources]);

  // Optimized search function
  const searchResources = useCallback(
    (resourceList: NetworkDevice[], searchQuery: string): NetworkDevice[] => {
      if (!searchQuery.trim()) {
        return resourceList;
      }

      const searchLower = searchQuery.toLowerCase().trim();
      const searchTerms = searchLower.split(' ').filter(term => term.length > 0);

      return resourceList.filter(resource => {
        // Create searchable text from resource properties
        const searchableFields = [
          resource.device_ex_address || '',
          resource.device_in_address || '',
          resource.device_name || '',
          resource.device_os || '',
          resource.device_class || '',
          resource.neuroscan_main_domain || '',
        ];

        // Parse and include domains from all_found_domains
        try {
          const domains = JSON.parse(resource.all_found_domains || '[]');
          if (Array.isArray(domains)) {
            searchableFields.push(...domains);
          }
        } catch {
          // Ignore parsing errors
        }

        const searchableText = searchableFields
          .filter(field => field && typeof field === 'string')
          .join(' ')
          .toLowerCase();

        // Check if all search terms match
        return searchTerms.every(term => searchableText.includes(term));
      });
    },
    []
  );

  // Filter resources with memoization
  const filteredResources = useMemo(() => {
    return searchResources(flattenedResources, debouncedSearchTerm);
  }, [flattenedResources, debouncedSearchTerm, searchResources]);

  // Debounced search term update
  useEffect(() => {
    setIsSearching(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filteredResources,
    isSearching,
    totalCount: flattenedResources.length,
    filteredCount: filteredResources.length,
  };
};
