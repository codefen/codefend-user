import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { useMemo } from 'react';

interface HookProps {
  type?: string;
  showDetails?: boolean;
  appMedia: string;
}

export const useAppCard = (props: HookProps) => {
  const isDetails = useMemo(() => Boolean(props.showDetails), [props.showDetails]);
  const isMobileType = useMemo(() => props.type === RESOURCE_CLASS.MOBILE, [props.type]);

  const isImage = useMemo(
    () => props.appMedia.trim() && props.appMedia !== undefined,
    [props.appMedia]
  );

  return {
    isImage,
    isDetails,
    isMobileType,
  };
};
