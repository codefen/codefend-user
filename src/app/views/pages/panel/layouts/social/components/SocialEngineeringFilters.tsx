import { useMemo, useState } from 'react';
import type { MemberV2 } from '@interfaces/panel';
import type { SocialFilterState } from '@/app/data/hooks/resources/social/useSocialFilters';
import { ChevronIcon, FilterIcon } from '@icons';

interface SocialEngineeringFiltersProps {
  members: MemberV2[];
  domains: { resource_domain: string; count: number }[];
  handleFilters: (filterType: keyof SocialFilterState, value: string) => void;
  currentFilters: SocialFilterState;
}

export const SocialEngineeringFilters: React.FC<SocialEngineeringFiltersProps> = ({
  members,
  domains,
  handleFilters,
  currentFilters,
}) => {
  const [isDomainExpanded, setIsDomainExpanded] = useState(true);
  const [isDataExpanded, setIsDataExpanded] = useState(true);

  const membersFilteredByDomain = useMemo(() => {
    if (currentFilters.resource_domain.length === 0) {
      return members;
    }
    return members.filter(
      member =>
        member.resource_domain &&
        currentFilters.resource_domain.includes(member.resource_domain),
    );
  }, [members, currentFilters.resource_domain]);

  const membersFilteredByProperties = useMemo(() => {
    if (currentFilters.properties.length === 0) {
      return members;
    }
    return members.filter(member =>
      currentFilters.properties.every(property => {
        if (property === 'has_name') return !!member.name;
        if (property === 'has_linkedin') return !!member.linkedin_url;
        return true;
      }),
    );
  }, [members, currentFilters.properties]);

  const resourceDomains = useMemo(() => {
    return domains.map(d => [d.resource_domain, d.count.toString()]);
  }, [domains]);

  const availableData = useMemo(() => {
    const data = {
      has_name: 0,
      has_linkedin: 0,
    };
    membersFilteredByDomain.forEach(member => {
      if (member.name) {
        data.has_name++;
      }
      if (member.linkedin_url) {
        data.has_linkedin++;
      }
    });
    return data;
  }, [membersFilteredByDomain]);

  return (
    <div className="card filtered">
      <div className="header">
        <FilterIcon />
        <span>Filter by</span>
      </div>
      <div className="content filters">
        <div className={`filter-group ${isDomainExpanded ? 'expanded' : ''}`}>
          <button className="filter-group-btn" onClick={() => setIsDomainExpanded(!isDomainExpanded)}>
            <ChevronIcon />
            <h3>Domain</h3>
          </button>
          <div className="filter-group-content">
            {resourceDomains.length === 0 ? (
              <p className="no-results-found">no results found</p>
            ) : (
              resourceDomains.map(([domain, count]) => (
                <label
                  className="filter"
                  key={domain}
                  htmlFor={`domain-${domain}`}>
                  <div className="check">
                    <div className="label">
                      <input
                        type="checkbox"
                        disabled={Number(count) === 0}
                        checked={currentFilters.resource_domain.includes(domain)}
                        onChange={() => handleFilters('resource_domain', domain)}
                        className="codefend-checkbox"
                        id={`domain-${domain}`}
                      />
                      {domain}
                    </div>
                  </div>
                  <div className="value">
                    <img src="/codefend/issues-bug-icon.svg" alt="bug-icon" />
                    <span>{count}</span>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className={`filter-group ${isDataExpanded ? 'expanded' : ''}`}>
          <button className="filter-group-btn" onClick={() => setIsDataExpanded(!isDataExpanded)}>
            <ChevronIcon />
            <h3>Available data</h3>
          </button>
          <div className="filter-group-content">
            <label
              className="filter"
              htmlFor="has_name">
              <div className="check">
                <div className="label">
                  <input
                    type="checkbox"
                    disabled={availableData.has_name === 0}
                    checked={currentFilters.properties.includes('has_name')}
                    onChange={() => handleFilters('properties', 'has_name')}
                    className="codefend-checkbox"
                    id="has_name"
                  />
                  has name
                </div>
              </div>
              <div className="value">
                <img src="/codefend/issues-bug-icon.svg" alt="bug-icon" />
                <span>{availableData.has_name}</span>
              </div>
            </label>
            <label
              className="filter"
              htmlFor="has_linkedin">
              <div className="check">
                <div className="label">
                  <input
                    type="checkbox"
                    disabled={availableData.has_linkedin === 0}
                    checked={currentFilters.properties.includes('has_linkedin')}
                    onChange={() => handleFilters('properties', 'has_linkedin')}
                    className="codefend-checkbox"
                    id="has_linkedin"
                  />
                  has linkedin
                </div>
              </div>
              <div className="value">
                <img src="/codefend/issues-bug-icon.svg" alt="bug-icon" />
                <span>{availableData.has_linkedin}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}; 