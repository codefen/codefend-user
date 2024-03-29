import { useEffect, useMemo, useState } from 'react';
import { useOrderStore, useShowScreen, useSocial } from '../../../../../data';
import SocialEngineering from './components/SocialEngineering';
import SocialEngineeringMembers from './components/SocialEngineeringMembers';
import './socialEngineering.scss';
import { useFlashlight } from '../../FlashLightContext';
import { OrderV2, PrimaryButton } from '../../../../components';

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

	const handleFilter = useMemo(() => {
		const isFiltered =
			socialFilters.department.size !== 0 ||
			socialFilters.attackVectors.size !== 0;
		if (!isFiltered) return { isFiltered };
		if (!members) return { isFiltered: false };

		const filteredData = members.filter((member) =>
			socialFilters.department.has(member.member_role),
		);

		return { filteredData, isFiltered };
	}, [members, socialFilters]);

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
						socials={
							handleFilter.isFiltered
								? handleFilter.filteredData!
								: members ?? []
						}
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
						members={members ?? []}
						handleDepartmentFilter={handleDepartmentFIlter}
					/>
				</section>
			</main>
		</>
	);
};

export default SocialEngineeringView;
