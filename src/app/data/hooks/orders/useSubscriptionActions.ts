import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';

export const useSubscriptionActions = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();

  const cancelSubscription = async (order: any) => {
    const companyId = getCompany();

    if (companyIdIsNull(companyId)) {
      toast.error('Company information not found.');
      return false;
    }

    try {
      const { data } = await fetcher('post', {
        body: {
          company_id: companyId,
          order_id: order.id,
          reference_number: order.reference_number,
        },
        path: '/orders/cancel',
      });

      if ((data as any)?.error === '1' || (data as any)?.response === 'error') {
        toast.error((data as any)?.message || 'Failed to cancel subscription.');
        return false;
      }

      toast.success('Subscription cancelled successfully.');
      return true;
    } catch (error: any) {
      toast.error(error?.message || 'An unexpected error occurred while cancelling subscription.');
      return false;
    }
  };

  const upgradePlan = async (order: any, newPlan?: string) => {
    const companyId = getCompany();

    if (companyIdIsNull(companyId)) {
      toast.error('Company information not found.');
      return false;
    }

    try {
      const { data } = await fetcher('post', {
        body: {
          company_id: companyId,
          order_id: order.id,
          reference_number: order.reference_number,
          new_plan: newPlan,
        },
        path: '/orders/upgrade',
      });

      if ((data as any)?.error === '1' || (data as any)?.response === 'error') {
        toast.error((data as any)?.message || 'Failed to upgrade plan.');
        return false;
      }

      toast.success('Plan upgraded successfully.');
      return true;
    } catch (error: any) {
      toast.error(error?.message || 'An unexpected error occurred while upgrading plan.');
      return false;
    }
  };

  return {
    cancelSubscription,
    upgradePlan,
  };
};
