import { ResourceIcon } from '@/app/views/components/ResourceIcon/ResourceIcon';
import { ResourcesTypes } from '@interfaces/order';

export const ResourcePlanImage = ({
  plan,
  resourceType,
}: {
  plan: string;
  resourceType: string;
}) => {
  console.log('resourceType', resourceType);
  return (
    <div className="plan-images">
      <img src={`/codefend/${plan}-plan.png`} width={90} height={90} alt="recommended-plan" />
      <div className="plan-icon">
        <ResourceIcon
          resourceClass={resourceType === ResourcesTypes.NETWORK ? 'lan' : resourceType}
        />
      </div>
    </div>
  );
};
