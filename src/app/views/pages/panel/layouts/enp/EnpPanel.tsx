import React, { useEffect, useState } from 'react';

import { ScanButton } from './components/ScanButton';
import { ReportButton } from './components/ReportButton';
import { ScanNetworkGraph } from './components/ScanNetworkGraph';
import { ModalOS } from './components/ModalOS';
import { ImSpinner8 } from "react-icons/im";
import { EndpointAppProvider } from './EndpointContext';
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { useNavigate } from 'react-router';
import moment from 'moment';
import { FaRegTimesCircle, FaShieldAlt } from "react-icons/fa";

import {
    useAuthState,
    useScanLocal,
	EnpService
} from '../../../../../data';

import {
    Show,
} from '../../../../components';

import './endpoints.scss';

interface Props {}

interface IOSIconProps {
    osName: string;
}

export const EnpPanel: React.FC<Props> = (props) => {
    const { getAccessToken } = useAuthState();
	const { getCompany } = useAuthState();
    const [showScreen, setShowScreen] = useState<boolean>(false);
	const [scans, setScans] = useState<any[]>([]);
	const [scansFiltered, setScansFiltered] = useState<any[]>([]);
    const { scanLoading, scanLocal } = useScanLocal(getAccessToken());
    const [refresh, setRefresh] = useState<boolean>(false);
	const navigate = useNavigate();

    useEffect(() => {
		const companyID = getCompany();
		EnpService.getScans(companyID)
		  .then((scans) => {
			setScans(scans.data);

            if(scans?.data?.length) {
			    setScansFiltered(processScans(scans.data));
            }
		  });
        setShowScreen(false);
        const timeoutId = setTimeout(() => setShowScreen(true), 50);
        return () => clearTimeout(timeoutId);
    }, [refresh]);

    function processScans(scans: any) {
        const groupedScans = scans.reduce((acc: any, scan: any) => {
            const macAddress = scan.device_mac_address;
            if (!acc[macAddress]) {
                acc[macAddress] = [];
            }
            acc[macAddress].push(scan);
            return acc;
        }, {});
    
        return Object.values(groupedScans).map((scans: any) => {
            const latestScan = scans.sort((a: any, b: any) => {
                return new Date(b.creacion).getTime() - new Date(a.creacion).getTime();
            })[0];
    
            latestScan.additionalScans = scans.length - 1;
            return latestScan;
        });
    }
    
    function formatKeyName(key: any) {
        return key.split('_')
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function processCompliance(scan: any) {
        if (!scan.report_data) {
            return 0;
        }

        try {
            const report = JSON.parse(scan.report_data);
    
            for (const key in report) {
                if (report.hasOwnProperty(key)) {
                    const value = report[key];
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                            return 0;
                        }
                    } else if (typeof value === 'boolean' && !value) {
                        return 0;
                    }
                }
            }

            return 1;
        } catch (err) {
            return 0;
        }

    }

    function isScanComplianceValid(scan: any) {
        if (!scan.report_data) {
            return false;
        }

        try {
            JSON.parse(scan.report_data);
            return true;
        } catch (err) {
            return false;
        }

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
        <main className={`enp ${showScreen && 'actived'}`}>
            <header className='enp-header'>
                <h2>ENDPOINT</h2>
                <h3>DEVICE INVENTORY</h3>
            </header>

            <div className="buttons-bar">
                <div className="buttons-bar-wrapper ">
                    <section>
                        <ScanButton
                            onClick={() => scanLocal()}
                            scanLoading={scanLoading}
                            scanLocal={scanLocal}
                        />
                    </section>
                </div>

                <div className="buttons-bar-wrapper">
                    <section>
                        <ReportButton
                            onClick={() => {
                                true;
                            }}
                        />
                    </section>
                </div>
            </div>

            <ModalOS/>
            <div className="enp-graphics">
                <ScanNetworkGraph data={scans} filteredData={scansFiltered} />
            </div>
            
            <div>
                <div className="enp-table-header">
                    <div className="enp-table-title">
                        <h3>Scanned devices</h3>
                    </div>
        
                    <div className="enp-table-columns">
                        <div className="enp-table-column">device name</div>
                        <div className="enp-table-column">operating system</div>
                        <div className="enp-table-column">latest scan</div>
                        <div className="enp-table-column">apps found</div>
                        <div className="enp-table-column">compliance ready</div>
                        <div className="enp-table-column">status</div>
                        <div className="enp-table-column">scans</div>
                    </div>
                </div>
                <Show when={scansFiltered.length > 0}>
                    <div className="enp-table-content">
                        {scansFiltered.map((scan) => (
                            <div key={`device-${scan.id}`} className="enp-content-row" onClick={() => {
                                navigate('/enp/' + scan.id)
                            }}>
                                <div className="enp-content-item">{scan.device_os_name}</div>
                                <div className="enp-content-item">{scan.device_os_release}</div>
                                <div className="enp-content-item">{moment(scan.creacion).fromNow()}</div>
                                <div className="enp-content-item">{scan.apps_found}</div>
                                <div className="enp-content-item enp-compliance">
                                    <Show when={processCompliance(scan) === 1}>
                                        <button className="enp-btn enp-scan-btn">
                                            <span>compliant</span>
                                        </button>
                                    </Show>
                                    <Show when={!processCompliance(scan)}>
                                        <button className="enp-btn enp-report-btn">
                                            <span>non compliant</span>
                                        </button>
                                    </Show>

                                    <div className="enp-compliance-details">
                                        {
                                            isScanComplianceValid(scan) ? Object.entries(JSON.parse(scan.report_data)).map(([key, value]: [string, any]) => (
                                                <div className={(!value ? "enp-compliance-failed" : "enp-compliance-success") + " flex"}>
                                                    <Show when={!value}>
                                                        <FaRegTimesCircle/>
                                                    </Show>
                                                    <Show when={value}>
                                                        <FaShieldAlt/>
                                                    </Show>

                                                    <p className="ml-2">{formatKeyName(key)}:</p>

                                                    <Show when={value === false || value.length === 0}>
                                                        <p className="ml-2"> Not detected</p>
                                                    </Show>
                                                    <Show when={value === true}>
                                                        <p className="ml-2"> Detected</p>
                                                    </Show>
                                                    <Show when={value.length != 0}>
                                                        <p className="ml-2"> {value}</p>
                                                    </Show>
                                                </div>
                                            )): ''

                                        }
                                    </div>
                                </div>
                                <div className="enp-content-item small">
                                    {Number(scan.scanned) == 1 ? (
                                        <p className="p-default">Finished</p>
                                    ) : (
                                        <div className="enp-table-progres">
                                            <ImSpinner8 className="w-3 h-3 ml-1 mr-2 text-gray-600 animate-spin" />
                                            <p>In progress</p>
                                        </div>
                                    )}
                                </div>
                                <div className="enp-content-item small">
                                    {scan.additionalScans + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </Show>
                <Show when={scansFiltered.length === 0}>
                    <div className="rounded-b mb-5 border-b border-slate-200 flex-grow hover:cursor-default">
                        <div className="flex items-center p-4 pl-6 border-x border-t text-slate-400 text-sm hover:cursor-default hover:bg-slate-50 duration-300 ease-in-out">
                            No scans found yet, you can perform your first one by clicking on request scan.
                        </div>
                    </div>
                </Show>

            </div>
        </main>
    </EndpointAppProvider>
    );
};

export default EnpPanel;
