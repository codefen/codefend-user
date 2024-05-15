import { useEffect, useMemo, useState } from 'react';
import { useOrderStore } from '@stores/orders.store.ts';
import SocialEngineering from './components/SocialEngineering.tsx';
import SocialEngineeringMembers from './components/SocialEngineeringMembers.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useSocial } from '@resourcesHooks/social/useSocial.ts';
import './socialEngineering.scss';
import Show from '@defaults/Show.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/index.ts';
import { AxiosHttpService } from '@services/axiosHTTP.service.ts';

const SocialEngineeringView = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { members, refetch, isLoading } = useSocial();
	const { updateState, scope } = useOrderStore((state) => state);
	const { isAdmin, isNormalUser } = useUserRole();
	const flashlight = useFlashlight();

	const [socialFilters, setSocialFilters] = useState({
		department: new Set<string>(),
		attackVectors: new Set<string>(),
	});

	useEffect(() => {
		refetch();
		return () => {
			const service = AxiosHttpService.getInstance();
			service.cancelAll();
		};
	}, [control]);

	const handleDepartmentFIlter = (role: string) => {
		setSocialFilters((prevState) => {
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
			socialFilters.department.size !== 0 ||
			socialFilters.attackVectors.size !== 0;

		if (!isFiltered || !members) return members || [];

		return members.filter((member: any) =>
			socialFilters.department.has(member.member_role),
		);
	}, [members, socialFilters.department]);

	return (
		<>
			<OrderV2 />
			<CredentialsModal />
			<ModalReport />
			<main className={`social ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<section className="left">
					<SocialEngineering
						refetch={refresh}
						isLoading={isLoading}
						socials={filteredData}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<Show when={members && Boolean(members.length)}>
						<SocialEngineeringMembers
							isLoading={isLoading}
							members={members || []}
							handleDepartmentFilter={handleDepartmentFIlter}
						/>
					</Show>
					<Show when={isAdmin() || isNormalUser()}>
						<PrimaryButton
							text="START A PENTEST ON DEMAND"
							className="primary-full"
							click={() => updateState('open', open)}
							disabledLoader
							isDisabled={scope.totalResources <= 0}
						/>
					</Show>
				</section>
			</main>
		</>
	);
};

export default SocialEngineeringView;
