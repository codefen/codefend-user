import { EmptyScreenView, AppCard, Show } from '../../../../../components';
import {
	CloudApp,
	SelectMobileCloudApp,
	generateIDArray,
	useSelectMobileCloudApp,
} from '../../../../../../data';
import React, { useEffect, useMemo, useState } from 'react';
import { CloudSelectedDetails } from './CloudSelectedDetails';

interface CloudApplicationProps {
	openModal: () => void;
	cloudData: CloudApp[];
}

export const CloudApplication = ({
	cloudData,
	openModal,
}: CloudApplicationProps) => {
	const { isNotNull, appSelected, isCurrentSelected, updateSelected } =
		useSelectMobileCloudApp((state: SelectMobileCloudApp) => state);

	const [term, setTerm] = useState('');

	const cloudKeys = useMemo(() => {
		return cloudData ? generateIDArray(cloudData.length) : [];
	}, [cloudData]);

	const selectCloud = (cloudApp: CloudApp) => {
		if (isNotNull() && isCurrentSelected(cloudApp.id)) return;
		updateSelected(cloudApp);
	};

	useEffect(() => {
		if (appSelected === null) {
			updateSelected(cloudData[0]);
		}
	}, [appSelected]);

	return (
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
					<div className="card cloud-apps">
						<div className="header">
							<div className="title">
								<span>Cloud Applications</span>
							</div>
							<div className="actions">
								<div onClick={openModal}>Add cloud</div>
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
										isActive={isCurrentSelected(app.id)}
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
	);
};
