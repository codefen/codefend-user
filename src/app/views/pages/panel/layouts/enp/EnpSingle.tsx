import React, { useEffect, useState } from 'react';

import { EndpointsSidebar } from './components/EndpointsSidebar';
import { EndpointInfo } from './components/EndpointInfo';
import { EndpointAppProvider, useEndpointAppStore } from './EndpointContext';
import { useParams } from 'react-router-dom';

import {
    useEnp,
    useAuthState
} from '../../../../../data';

import './endpoints.scss';

interface Props {}

interface Endpoint {
    id: string;
}

export const EnpPanel: React.FC<Props> = (props) => {
    const [showScreen, setShowScreen] = useState<boolean>(false);
    const { getAccessToken } = useAuthState();
    const { id: scanID } = useParams();
    const { getEndpoints, refetch, isLoading } = useEnp(Number(scanID));
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        refetch();
        setShowScreen(false);
        const timeoutId = setTimeout(() => setShowScreen(true), 50);
        return () => clearTimeout(timeoutId);
    }, [refresh]);

    const endpointsData: Endpoint[] = Boolean('data' in getEndpoints()) ? getEndpoints().data : [];
    const { endpointAppStore, setEndpointAppStore } = useEndpointAppStore();

    return (
        <EndpointAppProvider>
            <main className={`${showScreen ? 'actived' : ''}`}>
                <section className="w-1/3">
					<EndpointsSidebar
                        endpoints={endpointsData[0]}
                        isLoading={isLoading}
                    />
                </section>

                <section className="w-2/3">
					<EndpointInfo/>
                </section>
            </main>
        </EndpointAppProvider>
    );
};

export default EnpPanel;
