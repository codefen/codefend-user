import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface SocialFilterState {
  resource_domain: string[];
  properties: string[];
}

export const useSocialFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<SocialFilterState>({
    resource_domain: searchParams.get('resource_domain')?.split(',') || [],
    properties: [],
  });

  useEffect(() => {
    const domainsFromUrl = searchParams.get('resource_domain')?.split(',') || [];
    setFilters(prev => ({
      ...prev,
      resource_domain: domainsFromUrl,
    }));
  }, [searchParams]);

  const handleFilters = (filterType: keyof SocialFilterState, value: string) => {
    setFilters(prev => {
      const currentFilters = prev[filterType];
      const isRemoving = currentFilters.includes(value);
      const updated = isRemoving
        ? currentFilters.filter(filter => filter !== value)
        : [...currentFilters, value];

      const currentParams = Object.fromEntries(searchParams.entries());

      if (updated.length > 0) {
        currentParams[filterType] = updated.join(',');
      } else {
        delete currentParams[filterType];
      }

      setSearchParams(currentParams);

      return {
        ...prev,
        [filterType]: updated,
      };
    });
  };

  return { filters, handleFilters };
}; 