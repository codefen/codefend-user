import React, { useEffect, useState } from 'react';
import { ImSpinner8 } from "react-icons/im";
import { FaExclamationTriangle, FaBug } from "react-icons/fa";
import { Show } from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import moment from 'moment';

interface Props {
    endpoints: any;
	isLoading: Boolean;
}

interface IOSIconProps {
    osName: string;
}

export const EndpointsSidebar: React.FC<Props> = ({ endpoints, isLoading }) => {
    const [endpointApps, setEndpointApps] = useState<any[]>([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
    const [vulnerabilitiesCount, setVulnerabilitiesCount] = useState<number>(0);

    const { endpointAppStore, setEndpointAppStore } = useEndpointAppStore();
    useEffect(() => {
        setSelectedEndpoint(endpointAppStore);
    }, [endpointAppStore]);


    useEffect(() => {
        if (!isLoading && endpoints.length) {
			if (!endpoints.linked_application_data || endpoints.linked_application_data.length == 0) {
				setEndpointApps(endpoints.apps.map((app: any) => parseBadFormatEndpoint(app)));
			} else {
				setEndpointApps(endpoints.linked_application_data);
			}
        }
    }, [endpoints, isLoading]);

    function compareVersions(versionA: any, versionB: any) {
        if (!versionA) return -1;
        if (!versionB) return 0;

        const partsA = versionA.split('.').map(Number);
        const partsB = versionB.split('.').map(Number);

        const maxLength = Math.max(partsA.length, partsB.length);

        for (let i = 0; i < maxLength; i++) {
            const partA = partsA[i] || 0;
            const partB = partsB[i] || 0;

            if (partA > partB) return 1;
            if (partA < partB) return -1;
        }

        return 0;
    }

    function parseVersions(endpoint: any) {
        const versionsToCheck = [
            endpoint?.matched_devices?.[0]?.version,
            endpoint?.matched_devices?.[1]?.version,
            endpoint?.matched_devices?.[2]?.version,
            endpoint?.current_version,
        ];

        const foundVersion = versionsToCheck.find(version => version !== undefined);
        return foundVersion ?? false;
    }

    function updateEndpointVersion(endpoint: any) {
        const parsedVersion = parseVersions(endpoint);
        endpoint.current_version = parsedVersion;
        return endpoint;
    }

    function parseBadFormatEndpoint(input: any) {
        return {
            id: input.id,
            application_name: input.name || "",
            matched_devices: null,
            code_name: input.name.toLowerCase(),
            organization: input.developer,
            latest_version: null,
            current_version: input.version,
            app_update_date: null,
            icon_url: null,
            summary: null,
            vulnerabilities: -1,
        };
    }

    const sortEndpoints = (a: any, b: any) => {
        const getWeight = (endpoint: any) => {
            if (endpoint.latest_version && endpoint.current_version) return 3;
            if (endpoint.latest_version) return 2;
            if (endpoint.current_version) return 1;
            return 0;
        };

        const weightA = getWeight(a);
        const weightB = getWeight(b);

        if (weightA === weightB) {
            return compareVersions(b.latest_version, b.current_version) - compareVersions(a.latest_version, a.current_version);
        }

        return weightB - weightA;
    };

    const filterSearch = (searchValue: any) => {
        const filteredApps = endpoints.linked_application_data.filter((app: any) =>
            app.application_name.toLowerCase().includes(searchValue.toLowerCase())
        );

        setEndpointApps(filteredApps);
    };

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

    useEffect(() => {
        if (endpoints && endpoints.linked_application_data) {
            const updatedApps = endpoints.linked_application_data.map(updateEndpointVersion).sort(sortEndpoints);
            setEndpointApps(updatedApps);

			const totalVulnerabilities = endpoints.linked_application_data
				.reduce((sum: any, app: any) => {
					if (app.vulnerabilities !== undefined && app.vulnerabilities != -1) {
						return Number(sum) + Number(app.vulnerabilities);
					}
					return sum;
				}, 0);
	
			setVulnerabilitiesCount(totalVulnerabilities);
        }
    }, [endpoints]);


    return (
        <div className="flex-grow">
            {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-transparent">
                    <ImSpinner8 className="animate-spin h-5 w-5 text-red-400" />
                </div>
            ) : (
                <>

					<div className="flex flex-col p-4 m-4 ml-0">
						<div className="flex items-center justify-between border-solid border-b pb-6 border-stone-200">
							<div className="flex items-center mr-auto">
								<div className="inline-flex w-18 h-18">
									<span className="w-16 h-16 inline-flex rounded-md border-solid border border-stone-200 items-center justify-center">
										<OSIcon osName={endpoints.device_os_release} />
									</span>
								</div>
				
								<div className="flex flex-col ml-3 min-w-0">
									<div className="text-xl font-black leading-none text-gray-700">{endpoints.device_os_name}</div>
									<p className="text-base text-gray-500 leading-none mt-1 truncate">{endpoints.device_os_release}</p>
									<p className="text-sm text-gray-500 leading-none mt-1 truncate">{moment(endpoints.creacion).fromNow()}</p>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between ">
							<div className="flex p-2 items-center w-1/2 border-solid border-b border-r border-stone-200">
								<div className="flex ml-3 min-w-0">
									<p className="text-base font-bold text-red-400 leading-none mt-1 truncate">{vulnerabilitiesCount}</p>
									<p className="ml-2 text-base text-red-400 leading-none mt-1 truncate ">found vulnerabilities</p>
								</div>
							</div>
							<div className="flex p-2 items-center w-1/2 border-solid border-b border-stone-200">
								<div className="flex ml-3 min-w-0">
									<p className="text-base font-bold text-red-400 leading-none mt-1 truncate ">{endpoints.apps.length}</p>
									<p className="ml-2 text-base text-red-400 leading-none mt-1 truncate ">installed applications</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col m-4 mr-6 cursor-pointer hover:border-red-400 duration-300 ease-in-out ">
						<input
							onKeyDown={(e) => {
									const target = e.target as HTMLInputElement;
									filterSearch(target.value);
								}
							}
							type="text"
							className="p-3 text-sm"
							placeholder="Search"
							autoComplete="off"
						/>
					</div>

					<div className="overflow-y-auto overflow-x-hidden max-h-[65vh]">
						<Show when={endpoints.scanned == 0}>
							<div className="border-stone-200 flex flex-col p-4 m-4 mt-0 mb-8 border-solid border cursor-default hover:bg-stone-50 duration-300 ease-in-out">
								<div className="flex justify-between">
									<div className="inline-flex w-18 h-18">
										<div className="w-full h-full flex items-center justify-center bg-transparent">
											<ImSpinner8 className="animate-spin h-3 w-3 text-gray-500" />
										</div>
									</div>
									<div className="flex items-center mr-auto">
										<div className="flex flex-col ml-3 min-w-0">
											<div className="text-sm text-gray-500 flex">the scan is currently in process</div>
										</div>
									</div>
								</div>
							</div>
						</Show>

						{
							endpointApps.map(updateEndpointVersion).sort(sortEndpoints).map((endpoint: any) => (
								<div key={endpoint.id} className={(endpoint.id === selectedEndpoint?.id ? "border-red-400 " : "border-stone-200 ") + "flex flex-col p-4 m-4 mt-0 mb-8 border-solid border cursor-pointer hover:border-red-400 duration-300 ease-in-out"}
									onClick={() => {
										setEndpointAppStore(endpoint);
									}}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center mr-auto">
											<div className="inline-flex w-18 h-18 items-center justify-center">
												{endpoint.icon_url ? (
													<img src={endpoint.icon_url} alt="" className="w-12 h-12 inline-flex rounded-md border border-stone-200 opacity-75 object-cover" />
												) : (
													<span className="w-12 h-12 inline-flex rounded-md border-2 text-stone-400 border-stone-400 border-dotted opacity-75 items-center justify-center text-center font-semibold">
														{endpoint.application_name ? endpoint.application_name.charAt(0).toUpperCase() : ''}
													</span>
												)}
											</div>

											<div className="flex flex-col ml-3 min-w-0">
											<div className="font-bold leading-none text-gray-500">{endpoint.application_name}</div>
											<p className="text-sm text-gray-500 leading-none mt-1 truncate">{endpoint.organization}</p>
												<div className="flex min-w-0">
													<Show when={endpoint.current_version}>
														<p className="text-sm text-gray-500 leading-none mt-1 truncate">
															Version: {endpoint.current_version}
														</p>
													</Show>
													<Show when={
														endpoint.current_version &&
														endpoint.latest_version && 
														compareVersions(endpoint.latest_version, endpoint.current_version) == 1
													}>
															<p className="text-xs text-red-600 leading-none mt-1 ml-1 truncate"><FaExclamationTriangle /></p>
													</Show>
													<Show when={
														endpoint.vulnerabilities && endpoint.vulnerabilities != -1 
													}>
															<p className="text-xs text-red-600 leading-none mt-1 ml-1 truncate"><FaBug /></p>
													</Show>
												</div>
											</div>
										</div>
										<div className="flex flex-col ml-3 min-w-0">
											<Show when={
												endpoint.id === selectedEndpoint?.id
											}>
												<div className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 ml-2" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
													</svg>
												</div>
											</Show>
										</div>
									</div>
								</div>
							))
						}
					</div>
                </>
            )}
        </div>
    );
};