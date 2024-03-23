import React, { useEffect, useState } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches';
import SnsSearchAndData from './components/SnsSearchAndData';
import './Sns.scss';

const SnsPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowScreen(true);
		}, 50);
	});

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
