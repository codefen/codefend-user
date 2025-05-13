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
}

const SocialEngineeringMembers = ({ members, handleDepartmentFilter }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleShow = () => {
    setIsLoading(true);
    // lógica para mostrar el modal
  };

  const computedRoles = MetricsService.computeMemberRolesCount(members);

  return (
    <>
      <SimpleSection>
        <div className="card title">
          <div className="header">
            <GlobeWebIcon />
            <span>Social Engineering</span>
          </div>
          <div className="content">
            <p>
              Add profiles of your team members and company personnel to perform social engineering
              assessments and advanced phishing simulations.
            </p>
            <div className="actions">
              <PrimaryButton
                text="Add person"
                onClick={handleShow}
                className="btn-black"
                isDisabled={isLoading}
                disabledLoader={true}
              />
            </div>
          </div>
        </div>

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

              {/* <div className="value">
        <span className="icon-color">
          <PeopleGroupIcon />
        </span>
        <span>{computedRoles[role as keyof typeof computedRoles]} members</span>
      </div> */}
            </div>
          ))}
        </div>
      </SimpleSection>
    </>
  );
};

export default SocialEngineeringMembers;
