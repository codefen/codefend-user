import { useUserCommunicated } from '#commonUserHooks/useUserCommunicated';
import { useNewManageScanProgress } from '@moduleHooks/newscanner/useNewManageScanProgress';
import { useNewVerifyScanList } from '@moduleHooks/newscanner/useNewVerifyScanList';
import { useVerifyScanListv3 } from '@moduleHooks/newscanner/useVerifyScanListv3';

export const ScanWraper = () => {
  useVerifyScanListv3();
  // useNewManageScanProgress();
  useUserCommunicated();
  return <></>;
};
