import React, { useEffect, useMemo } from 'react';
import { AppCard } from './AppCard';
import {
	CloudApp,
	MobileApp,
	RemoveAppStore,
	useRemoveAppStore,
} from '../../../data';

interface AppCardInfoProps {
	type?: string;
	selectedApp: MobileApp | CloudApp;
}

export const AppCardInfo: React.FC<AppCardInfoProps> = ({
	type,
	selectedApp,
}) => {
	const isMobileType = type === 'mobile';
	const { setIsOpen, setData, setIsMobileType } = useRemoveAppStore(
		(state: RemoveAppStore) => state,
	);

	useEffect(() => {
		setData(selectedApp.id, selectedApp.appName);
		setIsOpen(false);
		setIsMobileType(isMobileType);
	}, [selectedApp]);

	return (
		<div
			className={`app-card-wrapper app-card-border ${
				!isMobileType ? 'notMobile' : ''
			}`}>
			<div className={`${isMobileType ? 'app-card-isMobile' : ''}`}>
				<AppCard
					showDetails
					type={type}
					id={selectedApp.id}
					appMedia={selectedApp.appMedia}
					appDesc={selectedApp.appDesc}
					name={selectedApp.appName}
					appReviews={
						'appReviews' in selectedApp ? selectedApp.appReviews : ''
					}
					appRank={'appRank' in selectedApp ? selectedApp.appRank : ''}
					appDeveloper={
						'appDeveloper' in selectedApp ? selectedApp.appDeveloper : ''
					}
					cloudProvider={
						'cloudProvider' in selectedApp
							? selectedApp.cloudProvider.toLowerCase()
							: ''
					}
				/>
			</div>
		</div>
	);
};
