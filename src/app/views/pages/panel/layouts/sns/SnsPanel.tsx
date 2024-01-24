import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import SnPreviousSearches from './components/SnPreviousSearches';
import SnsSearchAndData from './components/SnsSearchAndData';
import './Sns.scss'

interface Props {}

const SnsPanel: React.FC<Props> = (props: any) => {
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
					<Masonry
						breakpointCols={3}
						className="my-masonry-grid"
						columnClassName="my-masonry-grid_column">
					</Masonry>
				</section>

				<section className="right">
					<SnPreviousSearches />
				</section>
			</main>
		</>
	);
};

export default SnsPanel;
