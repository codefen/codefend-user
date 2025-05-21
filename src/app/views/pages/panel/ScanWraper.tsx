import { useUserCommunicated } from '#commonUserHooks/useUserCommunicated';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useManageScanProgress } from '@moduleHooks/neuroscan/useManageScanProgress';

export const ScanWraper = () => {
  useManageScanProgress();
  useUserCommunicated();
  return <></>;
};
