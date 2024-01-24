import React, { useMemo } from 'react';
import { AppCard } from './AppCard';
import { CloudApp, MobileApp } from '../../../data';
import { PrimaryButton } from '..';

interface AppCardInfoProps {
	type?: string;
	selectedApp: MobileApp | CloudApp;
}

export const AppCardInfo: React.FC<AppCardInfoProps> = ({
	type,
	selectedApp,
}) => {
	const isMobileType = useMemo(() => type === 'mobile', [type]);
	const buttonText = useMemo(
		() => (isMobileType ? ' Request pentest' : ' Request automated scan'),
		[isMobileType],
	);

	return (
		<div
			className={`app-card-wrapper app-card-border ${
				!isMobileType ? 'notMobile' : ''
			}`}>
			<div className={`${isMobileType ? 'app-card-isMobile' : ''}`}>
				<AppCard
					showDetails={true}
					isMobile={isMobileType}
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
							? selectedApp.cloudProvider
							: ''
					}
				/>
			</div>
			<PrimaryButton
				text={buttonText}
				click={(e) => {
					alert('Procesing your order');
				}}
			/>
		</div>
	);
};
