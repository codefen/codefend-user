import { type FC, useEffect, useState } from 'react';
import {
	AppleIcon,
	BugIcon,
	ButtonLoader,
	CheckIcon,
	LinuxIcon,
	PageLoader,
	Show,
	WarningIcon,
	WindowsIcon,
} from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';
import moment from 'moment';

interface Props {
	endpoints: any;
	isLoading: Boolean;
}

interface IOSIconProps {
	osName: string;
}

export const EndpointsSidebar: FC<Props> = ({ endpoints, isLoading }) => {
	const [endpointApps, setEndpointApps] = useState<any[]>([]);
	const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
	const [vulnerabilitiesCount, setVulnerabilitiesCount] = useState<number>(0);

	const { endpointAppStore, setEndpointAppStore } = useEndpointAppStore();
	useEffect(() => {
		setSelectedEndpoint(endpointAppStore);
	}, [endpointAppStore]);

	useEffect(() => {
		if (!isLoading && endpoints.length) {
			if (
				!endpoints.linked_application_data ||
				endpoints.linked_application_data.length == 0
			) {
				setEndpointApps(
					endpoints.apps.map((app: any) => parseBadFormatEndpoint(app)),
				);
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

		const foundVersion = versionsToCheck.find(
			(version) => version !== undefined,
		);
		return foundVersion ?? false;
	}

	const filterDuplicatesByCodeName = (apps: any) => {
		const filteredApps: any[] = [];
		const seenCodeNames = new Set();

		apps.forEach((app: any) => {
			if (!seenCodeNames.has(app.code_name)) {
				filteredApps.push(app);
				seenCodeNames.add(app.code_name);
			}
		});

		return filteredApps;
	};
	function updateEndpointVersion(endpoint: any) {
		const parsedVersion = parseVersions(endpoint);
		endpoint.current_version = parsedVersion;
		return endpoint;
	}

	function parseBadFormatEndpoint(input: any) {
		return {
			id: input.id,
			application_name: input.name || '',
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
			return (
				compareVersions(b.latest_version, b.current_version) -
				compareVersions(a.latest_version, a.current_version)
			);
		}

		return weightB - weightA;
	};

	const filterSearch = (searchValue: any) => {
		const filteredApps = endpoints.linked_application_data.filter(
			(app: any) =>
				app.application_name
					.toLowerCase()
					.includes(searchValue.toLowerCase()),
		);

		setEndpointApps(filteredApps);
	};

	const OSIcon: React.FC<IOSIconProps> = ({ osName }) => {
		const lowerCaseOSName = osName.toLowerCase();
		if (lowerCaseOSName.includes('windows')) {
			return <WindowsIcon styles="enp-os-icon" />;
		} else if (lowerCaseOSName.includes('mac')) {
			return <AppleIcon styles="enp-os-icon" />;
		} else {
			return <LinuxIcon styles="enp-os-icon" />;
		}
	};

	useEffect(() => {
		if (endpoints && endpoints.linked_application_data) {
			const updatedApps = endpoints.linked_application_data
				.map(updateEndpointVersion)
				.sort(sortEndpoints);
			setEndpointApps(updatedApps);

			const totalVulnerabilities = endpoints.linked_application_data.reduce(
				(sum: any, app: any) => {
					if (
						app.vulnerabilities !== undefined &&
						app.vulnerabilities != -1
					) {
						return Number(sum) + Number(app.vulnerabilities);
					}
					return sum;
				},
				0,
			);

			setVulnerabilitiesCount(totalVulnerabilities);
		}
	}, [endpoints]);

	return (
		<div className="enp-sidebar">
			{isLoading ? (
				<div className="sidebar-loader">
					<PageLoader />
				</div>
			) : (
				<>
					<div className="sidebar-header">
						<div className="sidebar-header-os">
							<div className="header-os-container">
								<div className="os-img-wrapper">
									<span className="os-img">
										<OSIcon osName={endpoints.device_os_release} />
									</span>
								</div>

								<div className="header-os-info">
									<div className="header-os-name">
										{endpoints.device_os_name}
									</div>
									<p className="header-os-release ">
										{endpoints.device_os_release}
									</p>
									<p className="header-os-date">
										{moment(endpoints.creacion).fromNow()}
									</p>
								</div>
							</div>
						</div>

						<div className="sidebar-header-results">
							<div className="header-results-founds">
								<div className="results-founds-wrapper">
									<p className="results-found-count">
										{vulnerabilitiesCount}
									</p>
									<p className="result-found-type">
										found vulnerabilities
									</p>
								</div>
							</div>
							<div className="header-results-founds right-no">
								<div className="results-founds-wrapper">
									<p className="results-found-count">
										{endpoints.apps.length}
									</p>
									<p className="result-found-type">
										installed applications
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="sidebar-search-bar">
						<input
							onKeyDown={(e) => {
								const target = e.target as HTMLInputElement;
								filterSearch(target.value);
							}}
							type="text"
							placeholder="Search"
							autoComplete="off"
						/>
					</div>

					<div className="sidebar-main-content">
						<Show when={endpoints.scanned == 0}>
							<div className="main-content-empty">
								<div className="main-content-empty-wrapper">
									<div className="content-empty-loader">
										<div className="empty-loader">
											<ButtonLoader />
										</div>
									</div>
									<div className="content-empty-message">
										<div className="content-empty-wrapper ">
											<div className="empty-message">
												the scan is currently in process
											</div>
										</div>
									</div>
								</div>
							</div>
						</Show>

						{filterDuplicatesByCodeName(endpointApps)
							.map(updateEndpointVersion)
							.sort(sortEndpoints)
							.map((endpoint: any) => (
								<div
									key={endpoint.id}
									className={
										(endpoint.id === selectedEndpoint?.id
											? 'selected '
											: 'no-selected ') + 'main-content-container'
									}
									onClick={() => {
										setEndpointAppStore(endpoint);
									}}>
									<div className="card-application">
										<div className="card-application-content">
											<div className="card-app-img-container">
												{endpoint.icon_url ? (
													<img
														src={endpoint.icon_url}
														alt=""
														className="app-img"
													/>
												) : (
													<span className="app-img no-img-url">
														{endpoint.application_name
															? endpoint.application_name
																	.charAt(0)
																	.toUpperCase()
															: ''}
													</span>
												)}
											</div>

											<div className="card-app-info-container">
												<div className="app-info-name">
													{endpoint.application_name}
												</div>
												<p className=" app-info-org">
													{endpoint.organization}
												</p>
												<div className="app-info-version">
													<Show when={endpoint.current_version}>
														<p className="current-version-text">
															Version: {endpoint.current_version}
														</p>
													</Show>
													<Show
														when={
															endpoint.current_version &&
															endpoint.latest_version &&
															compareVersions(
																endpoint.latest_version,
																endpoint.current_version,
															) == 1
														}>
														<p className="warning-icons">
															<WarningIcon />
														</p>
													</Show>
													<Show
														when={
															endpoint.vulnerabilities &&
															endpoint.vulnerabilities != -1
														}>
														<p className="warning-icons">
															<BugIcon />
														</p>
													</Show>
												</div>
											</div>
										</div>
										<div className="card-selected-check ">
											<Show
												when={endpoint.id === selectedEndpoint?.id}>
												<div className="check-icon-container">
													<CheckIcon />
												</div>
											</Show>
										</div>
									</div>
								</div>
							))}
					</div>
				</>
			)}
		</div>
	);
};
