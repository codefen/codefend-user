import { type FC, useEffect, useState } from 'react';
import { InxSearchAndData } from './components/InxSearchAndData';
import { InxPreviousSearches } from './components/InxPreviousSearches';
import { useInxPreviousSearch, useShowScreen } from '../../../../../data';
import { useFlashlight } from '../../FlashLightContext';
import './inx.scss';

export const InxPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { previousSearches, isLoading, refetch } = useInxPreviousSearch();
	const flashlight = useFlashlight();

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<main className={`issues-list ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<InxSearchAndData refetch={refetch} />
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<InxPreviousSearches
						isLoading={isLoading}
						previousSearches={previousSearches || []}
					/>
				</section>
			</main>
		</>
	);
};

export default InxPanel;
