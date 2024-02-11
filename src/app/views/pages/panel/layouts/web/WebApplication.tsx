import React, { useEffect, useState } from 'react';
import { WebApplicationResources } from './components/WebApplicationResources';
import { WebApplicationLocation } from './components/WebApplicationLocation';
import { WebApplicationStatics } from './components/WebApplicationStatics';
import { WebApplicationCredentials } from './components/WebApplicationCredentials';
import { useWebapplication } from '../../../../../data';
import '../../../../styles/flag.scss';
import '../../../../components/Table/table.scss';
import './webapplication.scss';
import { PrimaryButton } from '../../../../components';
import { useTheme } from '../../../../ThemeContext';

const WebApplicationView: React.FC = () => {
	//Custom Hook for Web panel view
	const { webResources, isLoading, refetch } = useWebapplication();
	const [showScreen, setShowScreen] = useState(false);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		refetch();
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [refresh]);

	const { changeTheme } = useTheme();

	return (
		<main className={`webapp ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<WebApplicationResources
					isLoading={isLoading}
					refresh={() => setRefresh(!refresh)}
					webResources={webResources.resources}
				/>
			</section>
			<section className="right">
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
					click={() => changeTheme()}
					className="w-full max-w-[96%] mt-4"
				/>
			</section>
		</main>
	);
};

export default WebApplicationView;
