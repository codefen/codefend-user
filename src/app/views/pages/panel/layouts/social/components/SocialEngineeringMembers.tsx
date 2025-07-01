import { FilterIcon, GlobeWebIcon } from '@icons';
import { PrimaryButton } from '@buttons/index';
import { PeopleGroupIcon, ChartIcon } from '@icons';
import { MetricsService } from '@utils/metric.service';
import type { MemberV2 } from '@interfaces/panel';
import { roleMap } from '@mocks/defaultData';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useState } from 'react';

interface Props {
  members: MemberV2[];
  handleDepartmentFilter: (role: string) => void;
  isLoading: boolean;
}

const SocialEngineeringMembers = ({ members, handleDepartmentFilter, isLoading }: Props) => {
  const computedRoles = MetricsService.computeMemberRolesCount(members);
  // console.log(computedRoles);
  return (
    <div className="card filtered">
      <div className="header">
        <FilterIcon />
        <span>Members by departments</span>
      </div>
      <div className="content filters">
        {Object.keys(computedRoles).map(role => (
          <div className="filter-group" key={role}>
            <div className="filter-group-content">
              <label className="filter">
                <div className="check">
                  <div className="label">
                    <input
                      type="checkbox"
                      onChange={() => handleDepartmentFilter(role)}
                      className="codefend-checkbox"
                    />
                    {roleMap[role as keyof typeof roleMap] ?? 'Unknown role'}
                  </div>
                  <div className="value">
                    <span>{0}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialEngineeringMembers;
