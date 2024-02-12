import { useEffect, useMemo, useState } from 'react';
import { useSocial } from '../../../../../data';
import SocialAttackVectors from './components/SocialAttackVectors';
import SocialEngineering from './components/SocialEngineering';
import SocialEngineeringMembers from './components/SocialEngineeringMembers';
import './socialEngineering.scss';

const SocialEngineeringView = () => {
	const { members, refetch, loading } = useSocial();
	const [showScreen, setShowScreen] = useState(false);

	const [socialFilters, setSocialFilters] = useState({
		department: new Set<string>(),
		attackVectors: new Set<string>(),
	});

	useEffect(() => {
		refetch();
		setShowScreen(false);
		setTimeout(() => {
			setShowScreen(true);
		}, 50);
	}, []);

	const handleDepartmentFIlter = (role: string) => {
		if (socialFilters.department.has(role)) {
			const updated = new Set(socialFilters.department);
			updated.delete(role);
			setSocialFilters((state: any) => ({ ...state, department: updated }));
		} else {
			setSocialFilters((state: any) => ({
				...state,
				department: new Set([...state.department, role]),
			}));
		}
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
				<section className="right">
					<SocialEngineeringMembers
						isLoading={loading}
						members={members ?? []}
						handleDepartmentFilter={handleDepartmentFIlter}
					/>
					<SocialAttackVectors />
				</section>
			</main>
		</>
	);
};

export default SocialEngineeringView;
