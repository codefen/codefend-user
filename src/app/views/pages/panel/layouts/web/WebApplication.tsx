import React, { useEffect, useState } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources';
import { WebApplicationLocation } from './components/WebApplicationLocation';
import { WebApplicationStatics } from './components/WebApplicationStatics';
import { WebApplicationCredentials } from './components/WebApplicationCredentials';
import { useOrderStore, useWebapplication } from '../../../../../data';
import '../../../../styles/flag.scss';
import '../../../../components/Table/table.scss';
import { OrderV2, PrimaryButton } from '../../../../components';
import { useFlashlight } from '../../FlashLightContext';
import './webapplication.scss';

const WebApplicationView: React.FC = () => {
	//Custom Hook for Web panel view
	const { webResources, isLoading, refetch } = useWebapplication();
	const [showScreen, setShowScreen] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const { updateState } = useOrderStore((state) => state);

	useEffect(() => {
		refetch();
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [refresh]);

	const flashlight = useFlashlight();

	return (
		<>
			<OrderV2 />
			<main className={`webapp ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<section className="left">
					<WebApplicationResources
						isLoading={isLoading}
						refresh={() => setRefresh(!refresh)}
						webResources={webResources.resources}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<WebApplicationLocation
						isLoading={isLoading}
						webResources={webResources.resources}
					/>

					<WebApplicationStatics
						webResources={webResources.resources}
						isLoading={isLoading}
					/>

					<WebApplicationCredentials />
					<PrimaryButton
						text="START A PENTEST ON DEMAND"
						click={() => updateState('open', true)}
						className="primary-full"
					/>
				</section>
			</main>
		</>
	);
};

export default WebApplicationView;
