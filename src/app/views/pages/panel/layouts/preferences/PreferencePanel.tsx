import { usePreferences } from '@panelHooks/preference/usePreferences.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import Show from '@defaults/Show.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import SettingCollaboratorAndTeam from './components/SettingCollaboratorAndTeam.tsx';
import SettingCompanyInformation from './components/SettingCompanyInformation.tsx';
import SettingOrderAndBilling from './components/SettingOrderAndBilling.tsx';
import SettingPersonalDetails from './components/SettingPersonaDetails.tsx';

import './preference.scss';
import { useEffect } from 'react';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store.ts';
import { ProviderScope } from '@modals/order-scope/OrderScope.tsx';
import { AddCollaboratorModal } from '@modals/adding-modals/AddCollaboratorModal.tsx';

const PreferencePanel = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { orders, company, members, isLoading, refetch } = usePreferences();
  const { isFinishQualityPoll } = useQualitySurveyStore();
  useEffect(() => {
    refetch();
  }, [isFinishQualityPoll, control]);

  return (
    <>
      <ProviderScope />
      <AddCollaboratorModal />
      <Show when={showScreen} fallback={<PageLoader />}>
        <main className={`preferences ${showScreen ? 'actived' : ''}`}>
          <section className="left">
            <SettingCollaboratorAndTeam
              isLoading={isLoading}
              members={members || []}
              refetch={refresh}
            />
            <SettingOrderAndBilling isLoading={isLoading} orders={orders || []} />
          </section>
          <section className="right">
            <SettingCompanyInformation companyInfo={company} />
            <SettingPersonalDetails />
          </section>
        </main>
      </Show>
    </>
  );
};

export default PreferencePanel;
