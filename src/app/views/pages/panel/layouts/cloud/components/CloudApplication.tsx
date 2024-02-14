import {
	EmptyScreenView,
	AppCard,
	Show,
	PrimaryButton,
} from '../../../../../components';
import {
	CloudApp,
	generateIDArray,
	useSelectedCloud,
} from '../../../../../../data';
import React, { useEffect, useMemo, useState } from 'react';
import { CloudSelectedDetails } from './CloudSelectedDetails';
import SelectedCloud from '../cloudProvider';

interface CloudApplicationProps {
	refresh: () => void;
	openModal: () => void;
	cloudData: CloudApp[];
}

export const CloudApplication = ({
	refresh,
	cloudData,
	openModal,
}: CloudApplicationProps) => {
	const {
		isNotNull,
		isCurrentCloudSelected,
		changeCloud,
		selectedCloud,
		dispatchCloud,
	} = useSelectedCloud();
	const [term, setTerm] = useState('');

	const cloudKeys = useMemo(() => {
		return cloudData ? generateIDArray(cloudData.length) : [];
	}, [cloudData]);

	const selectCloud = (mobile: CloudApp) => {
		if (isNotNull() && isCurrentCloudSelected(mobile.id)) return;
		dispatchCloud(mobile);
	};

	useEffect(() => {
		if (selectedCloud === null) {
			changeCloud(cloudData[0]);
		}
	}, [selectedCloud]);

	return (
		<SelectedCloud.Provider value={selectedCloud}>
			<Show
				when={cloudData && cloudData.length !== 0}
				fallback={
					<EmptyScreenView
						buttonText="Add Cloud"
						title="There's no data to display here"
						info="Start by clicking on the button below"
						event={() => openModal()}
					/>
				}>
				<>
					<div className="brightness variant-1"></div>
					<div className="brightness variant-2"></div>
					<div className="brightness variant-3"></div>
					<section className="left">
						<div className="card flex-grow">
							<div className="header">
								<div className="title">
									<div className="icon"></div>
									<span>Cloud Applications</span>
								</div>
								<div className="actions">
									<div onClick={openModal}>Add mobile app</div>
								</div>
							</div>
						</div>

						<input
							type="text"
							className="log-inputs search-app"
							placeholder="search"
							onChange={(e: any) => setTerm(e.target.value)}
						/>

						<div className="list">
							{cloudData
								.filter((cloud) =>
									cloud.appName
										.toLowerCase()
										.includes(term.toLowerCase()),
								)
								.map((app: CloudApp, index: number) => (
									<div
										className="app-info"
										key={cloudKeys[index]}
										onClick={() => selectCloud(app)}>
										<AppCard
											isActive={isCurrentCloudSelected(app.id)}
											onDone={(id: string) => {
												refresh();
												dispatchCloud(null);
											}}
											id={app.id}
											type="cloud"
											name={app.appName}
											appMedia={''}
											appDesc={app.appDesc}
											cloudProvider={app.cloudProvider.toLowerCase()}
										/>
									</div>
								))}
						</div>
					</section>
					<section className="right">
						<Show when={isNotNull()}>
							<CloudSelectedDetails />
						</Show>
					</section>
				</>
			</Show>
		</SelectedCloud.Provider>
	);
};
