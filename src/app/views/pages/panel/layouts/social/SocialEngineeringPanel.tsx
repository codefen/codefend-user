import { useEffect, useMemo, useState } from 'react';
import SocialEngineering from './components/SocialEngineering.tsx';
import SocialEngineeringMembers from './components/SocialEngineeringMembers.tsx';
import { useFlashlight } from '../../../../context/FlashLightContext.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useSocial } from '@resourcesHooks/social/useSocial.ts';
import './socialEngineering.scss';
import Show from '@/app/views/components/Show/Show.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import { socialEmptyScreen } from '@/app/constants/app-texts.ts';
import { ResourcesTypes } from '@interfaces/order.ts';
import OpenOrderButton from '@/app/views/components/OpenOrderButton/OpenOrderButton.tsx';

const SocialEngineeringView = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { members, refetch, isLoading } = useSocial();
  const flashlight = useFlashlight();

  const [socialFilters, setSocialFilters] = useState({
    department: new Set<string>(),
    attackVectors: new Set<string>(),
  });

  useEffect(() => {
    refetch();
  }, [control]);

  const handleDepartmentFIlter = (role: string) => {
    setSocialFilters(prevState => {
      const updatedDepartment = new Set(prevState.department);

      if (updatedDepartment.has(role)) {
        updatedDepartment.delete(role);
      } else {
        updatedDepartment.add(role);
      }

      return { ...prevState, department: updatedDepartment };
    });
  };

  const filteredData = useMemo(() => {
    const isFiltered =
      socialFilters.department.size !== 0 || socialFilters.attackVectors.size !== 0;

    if (!isFiltered || !members) return members || [];

    return members.filter((member: any) => socialFilters.department.has(member.member_role));
  }, [members, socialFilters.department]);

  return (
    <EmptyLayout
      className="social"
      fallback={socialEmptyScreen}
      event={refresh}
      showScreen={showScreen}
      isLoading={isLoading}
      dataAvailable={Boolean(members.length)}>
      <OrderV2 />
      <CredentialsModal />
      <ModalReport />
      <div className="brightness variant-1"></div>
      <div className="brightness variant-2"></div>
      <section className="left">
        <SocialEngineering refetch={refresh} isLoading={isLoading} socials={filteredData} />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <Show when={members && Boolean(members.length)}>
          <SocialEngineeringMembers
            isLoading={isLoading}
            members={members || []}
            handleDepartmentFilter={handleDepartmentFIlter}
          />
        </Show>

        <OpenOrderButton
          className="primary-full"
          type={ResourcesTypes.SOCIAL}
          resourceCount={members?.length || 0}
          isLoading={isLoading}
        />
      </section>
    </EmptyLayout>
  );
};

export default SocialEngineeringView;
