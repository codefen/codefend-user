import { useMemo } from 'react';
import type { MemberV2 } from '@interfaces/panel';
import type { SocialFilterState } from '@/app/data/hooks/resources/social/useSocialFilters';

interface SocialEngineeringFiltersProps {
  members: MemberV2[];
  handleFilters: (filterType: keyof SocialFilterState, value: string) => void;
  currentFilters: SocialFilterState;
}

export const SocialEngineeringFilters: React.FC<SocialEngineeringFiltersProps> = ({
  members,
  handleFilters,
  currentFilters,
}) => {
  const resourceAddresses = useMemo(() => {
    const addresses = new Map<string, number>();
    members.forEach(member => {
      if (member.resource_domain) {
        addresses.set(member.resource_domain, (addresses.get(member.resource_domain) || 0) + 1);
      }
    });
    return Array.from(addresses.entries());
  }, [members]);

  return (
    <div className="card">
      <div className="header">
        <div className="table-title">
          <h2>
            Filter by Domain
          </h2>
        </div>
      </div>
      <div className="content">
        <ul>
          {resourceAddresses.map(([address, count]) => (
            <li key={address} onClick={() => handleFilters('resource_domain', address)} style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={currentFilters.resource_domain.includes(address)}
                readOnly
              />
              {address} ({count})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 