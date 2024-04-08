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

const SocialEngineeringView = () => {
	const [showScreen] = useShowScreen();
	const { members, refetch, loading } = useSocial();
	const { updateState } = useOrderStore((state) => state);

	const flashlight = useFlashlight();

	const [socialFilters, setSocialFilters] = useState({
		department: new Set<string>(),
		attackVectors: new Set<string>(),
	});

	useEffect(() => {
		refetch();
	}, []);

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
		console.log({ socialFilter: socialFilters.department });
		const isFiltered =
			socialFilters.department.size !== 0 ||
			socialFilters.attackVectors.size !== 0;

		if (!isFiltered || !members) return members || [];

		console.log({ members });
		const filterData = members.filter((member) =>
			socialFilters.department.has(member.member_role),
		);
		console.log({ filterData });
		return filterData;
	}, [members, socialFilters.department]);

	return (
		<>
			<OrderV2 />
			<main className={`social ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<div className="brightness variant-2"></div>
				<section className="left">
					<SocialEngineering
						refetch={refetch}
						isLoading={loading}
						socials={filteredData}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<PrimaryButton
						text="START A PENTEST ON DEMAND"
						className="primary-full"
						click={() => updateState('open', open)}
					/>
					<SocialEngineeringMembers
						isLoading={loading}
						members={members || []}
						handleDepartmentFilter={handleDepartmentFIlter}
					/>
				</section>
			</main>
		</>
	);
};

export default SocialEngineeringView;
