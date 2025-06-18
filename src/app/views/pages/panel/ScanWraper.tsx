import { useUserCommunicated } from '#commonUserHooks/useUserCommunicated';
import { useNewManageScanProgress } from '@moduleHooks/newscanner/useNewManageScanProgress';
import { useNewVerifyScanList } from '@moduleHooks/newscanner/useNewVerifyScanList';

export const ScanWraper = () => {
  useNewVerifyScanList();
  useNewManageScanProgress();
  useUserCommunicated();
  return <></>;
};
