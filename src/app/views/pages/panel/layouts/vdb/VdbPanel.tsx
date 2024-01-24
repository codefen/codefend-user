import React, { useEffect, useState } from 'react';
import { VdbPreviousSearches } from './components/VdbPreviousSearches';
import { VdbSearchData } from './components/VdbSearchData';
import Masonry from 'react-masonry-css';

interface Props {}

const VdbPanel: React.FC<Props> = (props) => {
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

					<Masonry
						breakpointCols={3}
						className="my-masonry-grid"
						columnClassName="my-masonry-grid_column"></Masonry>
				</section>
				<section className="right">
					<VdbPreviousSearches />
				</section>
			</main>
		</>
	);
};

export default VdbPanel;
