import { useShowScreen } from '#commonHooks/useShowScreen';
import { useEffect } from 'react';
import { ResellerHeader } from '../components/ResellerHeader';
import { ResourceByLocation } from '../../../../../components/standalones/ResourceByLocation';
import { useResellerUsers } from '@userHooks/resellers/useResellerUsers';
import { ResellerAllUser } from '../components/ResellerAllUser';
import '../reseller.scss';

const ResellerUsersLayout = () => {
	const [showScreen] = useShowScreen();

	const [users, { getResellerUsers, isLoading }] = useResellerUsers();

	useEffect(() => {
		getResellerUsers();
	}, []);

	return (
		<main className={`reseller ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ResellerHeader />
				<div className="reseller-tables table-users">
					<ResellerAllUser isLoading={isLoading} users={users.current} />
				</div>
			</section>
			<section className="right">
				<ResourceByLocation
					resource={users.current}
					isLoading={isLoading}
					type="g"
					title="Users by location"
				/>
			</section>
		</main>
	);
};
export default ResellerUsersLayout;
