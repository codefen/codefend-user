import { useSelectedApp } from '@resourcesHooks/global/useSelectedApp';
import { AppCard } from '@/app/views/components/AppCard/AppCard';
import useCredentialStore from '@stores/credential.store';
import { useEffect, useMemo, useState, type FC } from 'react';

interface LeftMobileCloudProps {
  resources: any[];
  openModal: () => void;
  type: string;
}

export const ListResourceWithSearch: FC<LeftMobileCloudProps> = ({
  resources,
  openModal,
  type,
}) => {
  const { appSelected, setAppSelected, isSelected } = useSelectedApp();
  const [term, setTerm] = useState('');

  const { setViewMore } = useCredentialStore();

  useEffect(() => {
    console.log('Entro al useEffect?', { appSelected, r: resources[0] });
    if (!appSelected) {
      setAppSelected(resources[0]);
    }
  }, [resources]);

  const updateSelectedApp = (resource: any) => {
    if (!isSelected(resource.id)) {
      setAppSelected(resource);
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
    <div className="card cloud-apps">
      <div className="over">
        <div className="header">
          <div className="title">
            <span>{type} Applications</span>
          </div>
          <div className="actions">
            <div onClick={openModal}>Add {type} app</div>
          </div>
        </div>
        <input
          type="text"
          className="log-inputs search-app"
          placeholder="search"
          onChange={(e: any) => setTerm(e.target.value)}
        />
        <div className="list">
          {resourceFiltered.map((resource, i) => (
            <div
              key={`${resource.id}-${i}`}
              className="app-info"
              onClick={() => updateSelectedApp(resource)}>
              <AppCard
                isActive={isSelected(resource.id)}
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
    </div>
  );
};
