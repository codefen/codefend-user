import { GlobeWebIcon } from '@icons';
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

  return (
    <div className="content filters">
      <h3 className="sub-title">Members by departments</h3>
      {Object.keys(computedRoles).map(role => (
        <div className="filter" key={role}>
          <div className="check">
            <label className="label">
              <input
                type="checkbox"
                onChange={() => handleDepartmentFilter(role)}
                className="codefend-checkbox"
              />
              {roleMap[role as keyof typeof roleMap] ?? 'Unknown role'}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialEngineeringMembers;
