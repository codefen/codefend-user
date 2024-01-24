import React, { useEffect, useState } from 'react';
import { InxSearchAndData } from './components/InxSearchAndData';
import { InxPreviousSearches } from './components/InxPreviousSearches';
import { useInxPreviousSearch } from '../../../../../data';
import './inx.scss';

export const InxPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [control, refresh] = useState(false);
	const { previousSearches, isLoading, refetch } = useInxPreviousSearch();
	useEffect(() => {
		refetch();
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [control]);

	return (
		<>
			<main className={`issues-list ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<InxSearchAndData refetch={() => refresh(!control)} />
				</section>
				<section className="right">
					<InxPreviousSearches
						isLoading={isLoading}
						previousSearches={previousSearches ?? []}
					/>
				</section>
			</main>
		</>
	);
};

export default InxPanel;
