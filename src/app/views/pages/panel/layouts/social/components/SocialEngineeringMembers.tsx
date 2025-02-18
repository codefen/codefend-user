import { type FC } from 'react';
import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import { PeopleGroupIcon, ChartIcon } from '@icons';
import { MetricsService } from '@utils/metric.service';
import type { MemberV2 } from '@interfaces/panel';
import { roleMap } from '@mocks/defaultData';

interface SocialEngineeringMembersProps {
  isLoading: boolean;
  members: MemberV2[];
  handleDepartmentFilter: (role: string) => void;
}

const SocialEngineeringMembers: FC<SocialEngineeringMembersProps> = ({
  members,
  handleDepartmentFilter,
}) => {
  const computedRoles = MetricsService.computeMemberRolesCount(members!);

  return (
    <>
      <div className="card filtered">
        <SimpleSection header="Members by departments" icon={<ChartIcon />}>
          <div className="content filters">
            {Object.keys(computedRoles).map(role => (
              <div className="filter" key={role}>
                <div className="check">
                  <label className="label">
                    <input
                      type="checkbox"
                      onChange={e => handleDepartmentFilter(role)}
                      className="codefend-checkbox"
                    />
                    {roleMap[role as keyof typeof roleMap] ?? 'Unknown role'}
                  </label>
                </div>
                <div className="value">
                  <span className="icon-color">
                    <PeopleGroupIcon />
                  </span>
                  <span>{computedRoles[role as keyof typeof computedRoles]} members</span>
                </div>
              </div>
            ))}
          </div>
        </SimpleSection>
      </div>
    </>
  );
};

export default SocialEngineeringMembers;
