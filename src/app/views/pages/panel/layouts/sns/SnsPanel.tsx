import type { FC } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches';
import SnsSearchAndData from './components/SnsSearchAndData';
import { useShowScreen } from '../../../../../data';
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
