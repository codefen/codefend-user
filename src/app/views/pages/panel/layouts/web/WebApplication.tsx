import React, { useEffect, useState } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources';
import { WebApplicationLocation } from './components/WebApplicationLocation';
import { WebApplicationStatics } from './components/WebApplicationStatics';
import { WebApplicationCredentials } from './components/WebApplicationCredentials';
import {
	useOrderStore,
	useShowScreen,
	useWebapplication,
} from '../../../../../data';
import { OrderV2, PrimaryButton, ModalReport } from '../../../../components';
import { useFlashlight } from '../../FlashLightContext';
import '../../../../styles/flag.scss';
import '../../../../components/Table/table.scss';
import './webapplication.scss';

const WebApplicationView: React.FC = () => {
	//Custom Hook for Web panel view
	const [showScreen, control, refresh] = useShowScreen();
	const { webResources, isLoading, refetch } = useWebapplication();
	const { updateState } = useOrderStore((state) => state);
	const flashlight = useFlashlight();

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<OrderV2 />
			<ModalReport />
			<main className={`webapp ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<section className="left">
					<WebApplicationResources
						isLoading={isLoading}
						refresh={refresh}
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
