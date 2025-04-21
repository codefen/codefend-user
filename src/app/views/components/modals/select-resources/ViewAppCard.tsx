import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import { useGetResources } from '@resourcesHooks/global/useGetResources';
import type { ScopeAlias } from '@interfaces/util';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';
import { AppCard } from '@/app/views/components/AppCard/AppCard';

export interface ViewAppCardProps {
  type: RESOURCE_CLASS;
  scopeALias: ScopeAlias;
  getReport: (id: string, type: RESOURCE_CLASS, count: number) => void;
  activeFilter: boolean;
  modalId: string;
}
const getPath = (alias: string) => {
  if (alias == RESOURCE_CLASS_ALIAS.MOBILE) return RESOURCE_CLASS.MOBILE;
  return RESOURCE_CLASS.CLOUD;
};
export const ViewAppCard: FC<ViewAppCardProps> = ({
  type,
  scopeALias,
  getReport,
  activeFilter,
  modalId,
}) => {
  const { getAnyResource } = useGetResources();
  const [isLoading, setLoading] = useState<boolean>(false);
  const apps = useRef<any[]>([]);

  useEffect(() => {
    setLoading(true);

    getAnyResource(getPath(scopeALias))
      .then(resources => {
        let filterResult = resources;
        apps.current = filterResult;
      })
      .finally(() => setLoading(false));
    return () => {
      apps.current = [];
    };
  }, [scopeALias]);
  const title =
    modalId === MODAL_KEY_OPEN.SELECT_REPORT
      ? `Select your ${type} resource to generate report`
      : `Select your ${type} resource to create issue`;
  return (
    <div className="app-card-container">
      <h3>{title}</h3>
      <div className="list">
        {apps.current && !isLoading
          ? apps.current.map((resource, i) => (
              <div
                key={`${resource.id}-${i}`}
                className={`app-info ${activeFilter && Number(resource?.final_issues) <= 0 ? 'app-card-disabled' : ''}`}
                onClick={(e: FormEvent) => {
                  e.preventDefault();
                  getReport(resource.id, type, resource?.final_issues);
                }}>
                <AppCard
                  id={resource.id}
                  type={type}
                  name={resource?.app_name || resource?.cloud_name || ''}
                  appDesc={resource?.app_desc || resource?.cloud_desc || ''}
                  appMedia={type == RESOURCE_CLASS.MOBILE ? resource?.app_media : ''}
                  appReviews={resource?.app_reviews || undefined}
                  appRank={resource?.app_rank || undefined}
                  appDeveloper={resource?.app_developer || undefined}
                  cloudProvider={resource?.cloud_provider || undefined}
                  issueCount={resource?.final_issues || 0}
                  activeViewCount={activeFilter}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};
