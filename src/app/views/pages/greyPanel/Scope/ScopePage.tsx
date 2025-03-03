import { useShowScreen } from '#commonHooks/useShowScreen';
import DashboardAssets from '@/app/components/DashboardAssets/DashboardAssets';
import { RadarScanner } from '@/app/components/RadarScaner/RadarScaner';
import { RightItemButton } from '@/app/components/RightItemButton/RightItemButton';
import { useDashboard } from '@panelHooks/index';
import css from './scopepage.module.scss';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { AddCollaboratorModal } from '@modals/adding-modals/AddCollaboratorModal';

export const ScopePage = () => {
  const [showScreen] = useShowScreen();
  const { data } = useDashboard();
  const { setModalId, setIsOpen } = useModalStore();

  const handleAddCollaborator = () => {
    setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
    setIsOpen(true);
  };
  return (
    <main className={`${showScreen ? 'actived' : ''}`}>
      <AddCollaboratorModal />
      <div className="brightness variant-1"></div>
      <section className="left">
        <DashboardAssets hasTitle={false} resources={data?.resources || {}} />
        <div className={css['radarScopeContainer']}>
          <RadarScanner notBichardos={true} />
          <div>
            <h2>Automatic surface expansion in progress</h2>
            <p>
              Please wait while our technical staff prepares a map of your infrastructure and
              resources. You may close the application—you will receive notifications by email, or{' '}
              <b>you may start adding the resources yourself.</b>
            </p>
            <button className="btn">add resources</button>
          </div>
        </div>
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
