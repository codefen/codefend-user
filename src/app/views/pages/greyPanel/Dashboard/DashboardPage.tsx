import { useShowScreen } from '#commonHooks/useShowScreen';
import DashboardAssets from '@/app/components/DashboardAssets/DashboardAssets';
import { DashboardInvoke } from '@/app/components/DashboardInvoke/DashboardInvoke';
import { RightItemButton } from '@/app/components/RightItemButton/RightItemButton';
import DashboardCollaborators from '@/app/components/DashboardCollaborators/DashboardCollaborators';
import { useDashboard } from '@panelHooks/index';

export const DashboardPage = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();

  return (
    <main className={`${showScreen ? 'actived' : ''}`}>
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <section className="left">
        <DashboardInvoke />
        <DashboardAssets resources={data?.resources || {}} />
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </section>
      <section className="right">
        <RightItemButton title="Add team members" description="Send us the first invitation" />
        <RightItemButton
          title="Add scope / attack surface"
          description="You can help us expand the scope."
        />
      </section>
    </main>
  );
};
