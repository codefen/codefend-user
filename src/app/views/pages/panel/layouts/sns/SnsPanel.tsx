import type { FC } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches.tsx';
import SnsSearchAndData from './components/SnsSearchAndData.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './Sns.scss';

const SnsPanel: FC = () => {
	const [showScreen] = useShowScreen();

	return (
		<>
			<main className={`sb ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<SnsSearchAndData />
				</section>

				<section className="right">
					<SnPreviousSearches />
				</section>
			</main>
		</>
	);
};

export default SnsPanel;
