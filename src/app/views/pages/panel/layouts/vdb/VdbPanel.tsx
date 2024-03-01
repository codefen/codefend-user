import React, { useEffect, useState } from 'react';
import { VdbPreviousSearches } from './components/VdbPreviousSearches';
import { VdbSearchData } from './components/VdbSearchData';
import './vdb.scss';

const VdbPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [refresh]);

	return (
		<>
			<main className={`sb ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<VdbSearchData />
				</section>
				<section className="right">
					<VdbPreviousSearches />
				</section>
			</main>
		</>
	);
};

export default VdbPanel;
