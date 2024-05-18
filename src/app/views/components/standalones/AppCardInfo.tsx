import { useEffect, type FC } from 'react';
import { AppCard } from './AppCard';
import { useReportStore } from '../../../data';
import { useRemoveAppStore } from '@stores/mobileCloudRemove.store';

interface AppCardInfoProps {
	type: string;
	selectedApp: any;
	issueCount: number;
}

export const AppCardInfo: FC<AppCardInfoProps> = ({
	type,
	selectedApp,
	issueCount,
}) => {
	const isMobileType = type === 'mobile';
	const { setIsOpen, setData, setIsMobileType } = useRemoveAppStore(
		(state) => state,
	);
	const { openModal, setResourceID, setResourceType } = useReportStore(
		(state) => state,
	);

	useEffect(() => {
		setData(selectedApp.id, selectedApp?.appName || selectedApp?.cloud_name);
		setIsOpen(false);
		setIsMobileType(isMobileType);
		setResourceID(selectedApp.id);
		setResourceType(type);
	}, [selectedApp]);

	const openReport = () => {
		if (issueCount >= 1) openModal();
	};
	return (
		<div
			className={`app-card-wrapper app-card-border ${
				!isMobileType ? 'notMobile' : ''
			}`}>
			<div className={`${isMobileType ? 'app-card-isMobile' : ''}`}>
				<AppCard
					showDetails
					openReport={openReport}
					id={selectedApp.id}
					type={type}
					issueCount={issueCount}
					appMedia={isMobileType ? selectedApp?.appMedia : ''}
					appDesc={selectedApp?.appDesc || selectedApp?.cloud_desc}
					name={selectedApp?.appName || selectedApp?.cloud_name}
					appReviews={selectedApp?.appReviews || undefined}
					appRank={selectedApp?.appRank || undefined}
					appDeveloper={selectedApp?.appDeveloper || undefined}
					cloudProvider={
						selectedApp?.cloud_provider
							? selectedApp.cloud_provider.toLowerCase()
							: undefined
					}
				/>
			</div>
		</div>
	);
};
