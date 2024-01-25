import React, { useEffect, useState } from 'react';

import { Endpoints } from './components/Endpoints';
import { ScanButton } from './components/ScanButton';
import { ModalOS } from './components/ModalOS';
import { ImSpinner8 } from "react-icons/im";
import { EndpointsSidebar } from './components/EndpointsSidebar';
import { EndpointInfo } from './components/EndpointInfo';
import { EndpointAppProvider, useEndpointAppStore } from './EndpointContext';
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { useNavigate } from 'react-router';

import {
    useModal,
    useSourceCode,
    useEnp,
    useAuthState,
    useScanLocal,
	EnpService
} from '../../../../../data';

import {
    EmptyScreenView,
    PageLoaderWhite,
    PrimaryButton,
	PageLoader,
    Show,
} from '../../../../components';

import './endpoints.scss';

interface Props {}

interface IOSIconProps {
    osName: string;
}

interface Endpoint {
    id: string;
}

export const EnpPanel: React.FC<Props> = (props) => {
    const { getAccessToken } = useAuthState();
	const { getUserdata } = useAuthState();
    const [showScreen, setShowScreen] = useState<boolean>(false);
	const [scans, setScans] = useState<any[]>([]);
    const { scanLoading, scanLocal } = useScanLocal(getAccessToken());
    const [refresh, setRefresh] = useState<boolean>(false);
	const navigate = useNavigate();

    useEffect(() => {
		const companyID = getUserdata()?.companyID as string;
		EnpService.getScans(companyID)
		  .then((scans) => {
            console.log(scans)
            let scandata = processScans(scans.data)
			setScans(scandata);
		  });
        setShowScreen(false);
        const timeoutId = setTimeout(() => setShowScreen(true), 50);
        return () => clearTimeout(timeoutId);
    }, [refresh]);

    function processScans(scans: any) {
        const groupedScans = scans.reduce((acc: any, scan: any) => {
            const macAddress = scan.F0_2F_74_34_78_32;
            acc[macAddress] = acc[macAddress] || [];
            acc[macAddress].push(scan);
            return acc;
        }, {});
    
        return Object.keys(groupedScans).map(mac => {
            const scans = groupedScans[mac];
            const firstScan = scans[0];
            firstScan.additionalScans = scans.length - 1;
            return firstScan;
        });
    }

    const OSIcon: React.FC<IOSIconProps> = ({ osName }) => {
        const lowerCaseOSName = osName.toLowerCase();
        if (lowerCaseOSName.includes('windows')) {
            return <FaWindows className="w-8 h-8 text-gray-600"/>;
        } else if (lowerCaseOSName.includes('mac')) {
            return <FaApple className="w-8 h-8 text-gray-600"/>;
        } else {
            return <FaLinux className="w-8 h-8 text-gray-600"/>;
        }
    };

    return (
    <EndpointAppProvider>
        <main className={`${showScreen ? 'actived' : ''} flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 ml-16 mt-4`}>
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Scan your device</h1>
            </header>
            <ScanButton
                onClick={() => scanLocal()}
                scanLoading={scanLoading} scanLocal={scanLocal} 
            />
            <ModalOS/>
            <div>
                <header className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">Scanned devices</h1>
                </header>
                <Show when={scans.length > 0}>
                    <section className="grid gap-16 md:grid-cols-3 lg:grid-cols-4">
                        {scans.map((scan) => (
                            <div key={scan.id} className="rounded border bg-card text-card-foreground h-full cursor-default">
                                <div className="flex items-center mr-auto p-4">
                                    <div className="inline-flex w-18 h-18">
                                        <span className="w-16 h-16 inline-flex rounded-md border-solid border border-stone-200 items-center justify-center">
                                            <OSIcon osName={scan.device_os_release} />
                                        </span>
                                    </div>
                    
                                    <div className="flex flex-col ml-3 min-w-0">
                                        <div className="text-xl font-black leading-none text-gray-700">{scan.device_os_name}</div>
                                        <p className="text-base text-gray-500 leading-none mt-1 truncate text-red-400">{scan.device_os_release}</p>
                                    </div>
                                </div>
                                <div className="p-2 pl-4 text-sm text-gray-800">
                                    {
                                        scan.scanned === 1 ?
                                            <p className="cursor-default font-bold">Finished</p>
                                        :
                                        <div className="w-full h-full flex items-center justify-left bg-transparent">
                                            <ImSpinner8 className="animate-spin h-3 w-3 text-gray-700 ml-1 mr-2" />
                                            <p>In progress</p>
                                        </div>
                                    }
                                    
                                </div>
                                <div className="p-2 pl-4 flex text-sm text-gray-600 font-bold border-y">
                                    <p className="cursor-default font-bold">Applications found: </p>
                                    <p className="cursor-default text-red-400 font-bold ml-1">{scan.apps_found}</p>
                                </div>
                                <div className="flex items-center p-4 text-sm text-gray-800">
                                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium cursor-pointer border bg-white text-red-400 rounded hover:bg-red-100 border-red-400"
                                        onClick={() => {
                                            navigate('/enp/' + scan.id)
                                        }}
                                    >
                                        View Details
                                    </button>
                                    {scan.additionalScans > 0 && (
                                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium cursor-pointer border bg-white text-red-400 rounded hover:bg-red-100 border-red-400 ml-auto">
                                            Show {scan.additionalScans} more scans
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                </Show>
            </div>
        </main>
    </EndpointAppProvider>
    );
};

export default EnpPanel;
