import {
	EmptyScreenView,
	ModalTitleWrapper,
	PageLoader,
	AppCard,
	Show,
	PrimaryButton,
} from '../../../../../components';
import {
	CloudApp,
	generateIDArray,
	useCloud,
	useModal,
	useSelectedCloud,
} from '../../../../../../data';
import React, { useEffect, useMemo } from 'react';
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
					<section className="left">
						<div className="add-button">
							<PrimaryButton
								text="ADD CLOUD"
								click={(e: React.FormEvent) => openModal()}
							/>
						</div>

						<div className="list">
							{cloudData.map((app: CloudApp, index: number) => (
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
										appMedia={app.appMedia}
										appDesc={app.appDesc}
										cloudProvider={app.cloudProvider}
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
