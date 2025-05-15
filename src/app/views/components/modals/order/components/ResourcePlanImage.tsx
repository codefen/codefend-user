import { ResourceIcon } from '@/app/views/components/ResourceIcon/ResourceIcon';
import { ResourcesTypes } from '@interfaces/order';
import { PLAN_IMAGE } from '@/app/constants/app-contanst';

export const ResourcePlanImage = ({
  plan,
  resourceType,
}: {
  plan: string;
  resourceType: string;
}) => {
  return (
    <div className="plan-images">
      <img
        src={PLAN_IMAGE[plan as keyof typeof PLAN_IMAGE]}
        width={90}
        height={90}
        alt="recommended-plan"
      />
      <div className="plan-icon">
        <ResourceIcon
          resourceClass={resourceType === ResourcesTypes.NETWORK ? 'lan' : resourceType}
        />
      </div>
    </div>
  );
};
