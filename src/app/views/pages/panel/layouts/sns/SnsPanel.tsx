import { useEffect, type FC } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches.tsx';
import SnsSearchAndData from './components/SnsSearchAndData.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './Sns.scss';
import { usePreviousSearch } from '@moduleHooks/usePreviousSearch.ts';

const SnsPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { previousSearches, isLoading, refetch } = usePreviousSearch('sns');

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<main className={`sb ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<SnsSearchAndData refetch={refresh} />
				</section>

				<section className="right">
					<SnPreviousSearches
						isLoading={isLoading}
						previousSearches={previousSearches || []}
					/>
				</section>
			</main>
		</>
	);
};

export default SnsPanel;
