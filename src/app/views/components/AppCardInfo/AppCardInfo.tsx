import { useEffect, type FC } from 'react';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { AppCard } from '@/app/views/components/AppCard/AppCard';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

interface AppCardInfoProps {
  type: string;
  selectedApp: any;
  issueCount: number;
}

export const AppCardInfo: FC<AppCardInfoProps> = ({ type, selectedApp, issueCount }) => {
  const isMobileType = type === RESOURCE_CLASS.MOBILE;
  const { resourceID, resourceType, openModal } = useGlobalFastFields([
    'resourceID',
    'resourceType',
    'openModal',
  ]);

  useEffect(() => {
    resourceID.set(selectedApp.id);
    resourceType.set(type as RESOURCE_CLASS);
  }, [selectedApp]);

  const openReport = () => {
    if (issueCount >= 1) openModal.set(true);
  };
  return (
    <div className={`app-card-wrapper app-card-border ${!isMobileType ? 'notMobile' : ''}`}>
      <div className={`${isMobileType ? 'app-card-isMobile' : ''}`}>
        <AppCard
          showDetails
          openReport={openReport}
          id={selectedApp.id}
          type={type}
          issueCount={issueCount}
          appMedia={isMobileType ? selectedApp?.app_media : ''}
          appDesc={selectedApp?.app_desc || selectedApp?.cloud_desc}
          name={selectedApp?.app_name || selectedApp?.cloud_name}
          appReviews={selectedApp?.app_reviews || undefined}
          appRank={selectedApp?.app_rank || undefined}
          appDeveloper={selectedApp?.app_developer || undefined}
          cloudProvider={
            selectedApp?.cloud_provider ? selectedApp.cloud_provider.toLowerCase() : undefined
          }
        />
      </div>
    </div>
  );
};
