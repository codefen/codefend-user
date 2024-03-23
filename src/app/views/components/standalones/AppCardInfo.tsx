import { useEffect, type FC } from 'react';
import { AppCard } from './AppCard';
import {
	type CloudApp,
	type MobileApp,
	type RemoveAppStore,
	useRemoveAppStore,
	useReportStore,
} from '../../../data';
import { toast } from 'react-toastify';

interface AppCardInfoProps {
	type?: string;
	selectedApp: MobileApp | CloudApp;
	issueCount: number;
}

export const AppCardInfo: FC<AppCardInfoProps> = ({
	type,
	selectedApp,
	issueCount,
}) => {
	const isMobileType = type === 'mobile';
	const { setIsOpen, setData, setIsMobileType } = useRemoveAppStore(
		(state: RemoveAppStore) => state,
	);
	const { openModal, setResourceID, setResourceType } = useReportStore(
		(state) => state,
	);

	useEffect(() => {
		setData(selectedApp.id, selectedApp.appName);
		setIsOpen(false);
		setIsMobileType(isMobileType);
		setResourceID(selectedApp.id);
		setResourceType(isMobileType ? 'mobile' : 'cloud');
	}, [selectedApp]);

	const openReport = () => {
		if (issueCount >= 1) {
			openModal();
		} else {
			toast.error(
				'This resource does not have issues to generate a report.',
			);
		}
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
