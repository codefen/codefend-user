import React, { useEffect, useState } from 'react';

import { EndpointsSidebar } from './components/EndpointsSidebar';
import { EndpointInfo } from './components/EndpointInfo';
import { EndpointAppProvider, useEndpointAppStore } from './EndpointContext';
import { useParams } from 'react-router-dom';

import { useEnp, useAuthState } from '../../../../../data';

import './enpSingle.scss';

interface Props {}

interface Endpoint {
	id: string;
}

export const EnpPanel: React.FC<Props> = (props) => {
	const [showScreen, setShowScreen] = useState<boolean>(false);
	const { id: scanID } = useParams();
	const { getEndpoints, refetch, isLoading } = useEnp(Number(scanID));
	const [refresh, setRefresh] = useState<boolean>(false);

	useEffect(() => {
		refetch();
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [refresh]);

	const endpointsData: Endpoint[] = Boolean('data' in getEndpoints())
		? getEndpoints().data
		: [];

	return (
		<EndpointAppProvider>
			<main className={`single-enp ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<EndpointsSidebar
						endpoints={endpointsData[0]}
						isLoading={isLoading}
					/>
				</section>

				<section className="right">
					<EndpointInfo />
				</section>
			</main>
		</EndpointAppProvider>
	);
};

export default EnpPanel;
