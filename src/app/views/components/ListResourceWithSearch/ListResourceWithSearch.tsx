import { AppCard } from '@/app/views/components/AppCard/AppCard';
import useCredentialStore from '@stores/credential.store';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { MagnifyingGlassIcon } from '@icons';

interface LeftMobileCloudProps {
  resources: any[];
  openModal: () => void;
  type: string;
}

export const ListResourceWithSearch: FC<LeftMobileCloudProps> = ({ resources, type }) => {
  const [term, setTerm] = useState('');
  const selectedAppStored = useGlobalFastField('selectedApp');
  const { setViewMore } = useCredentialStore();

  useEffect(() => {
    if (!selectedAppStored.get) {
      selectedAppStored.set(resources[0]);
    }
  }, [resources]);

  const updateSelectedApp = (resource: any) => {
    if (resource.id != selectedAppStored.get?.id) {
      selectedAppStored.set(resource);
    }
    setViewMore({ id: '', open: false });
  };

  const resourceFiltered = useMemo(
    () =>
      type == 'Mobile'
        ? resources.filter(app => app?.app_name.toLowerCase().includes(term.toLowerCase()))
        : resources.filter(app => app?.cloud_name.toLowerCase().includes(term.toLowerCase())),
    [term]
  );
  return (
    <>
      <div className="search-container">
        <ModalInput
          icon={<MagnifyingGlassIcon />}
          setValue={(val: string) => setTerm(val)}
          placeholder="Search..."
        />
      </div>
      <div className="card cloud-apps">
        <div className="list">
          {resourceFiltered.map((resource, i) => (
            <div
              key={`${resource.id}-${i}`}
              className="app-info"
              onClick={() => updateSelectedApp(resource)}>
              <AppCard
                isActive={resource.id == selectedAppStored.get?.id}
                id={resource.id}
                type={type.toLowerCase()}
                name={resource?.app_name || resource?.cloud_name}
                appMedia={type == 'Mobile' ? resource?.app_media : ''}
                appDesc={resource?.app_desc || resource?.cloud_desc}
                appReviews={resource?.app_reviews || undefined}
                appRank={resource?.app_rank || undefined}
                appDeveloper={resource?.app_developer || undefined}
                cloudProvider={
                  resource?.cloud_provider ? resource.cloud_provider.toLowerCase() : undefined
                }
                issueCount={resource.final_issue}
                activeViewCount
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
