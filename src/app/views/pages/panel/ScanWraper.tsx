import { useUserCommunicated } from '#commonUserHooks/useUserCommunicated';
import { useVerifyScanListv3 } from '@moduleHooks/newscanner/useVerifyScanListv3';

export const ScanWraper = () => {
  useVerifyScanListv3();
  useUserCommunicated();
  return <></>;
};
