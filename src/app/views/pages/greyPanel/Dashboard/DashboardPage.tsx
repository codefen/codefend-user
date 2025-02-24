import { useShowScreen } from '#commonHooks/useShowScreen';
import DashboardAssets from '@/app/components/DashboardAssets/DashboardAssets';
import { DashboardInvoke } from '@/app/components/DashboardInvoke/DashboardInvoke';
import { RightItemButton } from '@/app/components/RightItemButton/RightItemButton';
import DashboardCollaborators from '@/app/components/DashboardCollaborators/DashboardCollaborators';
import { useDashboard } from '@panelHooks/index';
import { AddCollaboratorModal } from '@modals/adding-modals/AddCollaboratorModal';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import DashboardVulnerabilities from '@/app/views/pages/panel/layouts/dashboard/components/DashboardVulnerabilities';
import { PageLoader } from '@defaults/index';

export const DashboardPage = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const { setModalId, setIsOpen } = useModalStore();

  const handleAddCollaborator = () => {
    setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
    setIsOpen(true);
  };
  return (
    <main className={`dashboard ${showScreen ? 'actived' : ''}`}>
      <AddCollaboratorModal />
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <section className="left">
        {data?.issues && data.issues.length > 0 ? (
          <DashboardVulnerabilities isLoading={isLoading} topVulnerabilities={data?.issues || []} />
        ) : !isLoading ? (
          <DashboardInvoke />
        ) : (
          <PageLoader />
        )}
        <DashboardAssets resources={data?.resources || {}} />
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </section>
      <section className="right">
        <RightItemButton
          title="Add team members"
          description="Send us the first invitation"
          img="/codefend/add-collab.png"
          action={handleAddCollaborator}
        />
        <RightItemButton
          title="Add scope / attack surface"
          description="You can help us expand the scope."
          img="/codefend/add-scope.png"
        />
      </section>
    </main>
  );
};
