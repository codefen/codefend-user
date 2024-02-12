import React, { useEffect, useMemo } from 'react';
import {
	AppCard,
	EmptyScreenView,
	PageLoader,
	PrimaryButton,
	Show,
} from '../../../../../components';
import {
	MobileApp,
	generateIDArray,
	useSelectedMobile,
} from '../../../../../../data';
import SelectedMobile from '../selectedContext';
import { MobileSelectedDetails } from './MobileSelectedDetails';

interface MobileApplicationProps {
	openModal: () => void;
	refresh: () => void;
	mobileInfo: MobileApp[];
	isLoading: boolean;
}

export const MobileApplication: React.FC<MobileApplicationProps> = ({
	openModal,
	refresh,
	mobileInfo,
	isLoading,
}) => {
	const {
		selectedMobileApp,
		setSelectedMobileApp,
		isCurrentMobileSelected,
		changeMobile,
		isNotNull,
	} = useSelectedMobile();

	const mobileKeys = useMemo(() => {
		return mobileInfo ? generateIDArray(mobileInfo.length) : [];
	}, [mobileInfo]);

	const selectMobile = (mobile: MobileApp) => {
		if (isNotNull() && isCurrentMobileSelected(mobile.id)) return;
		setSelectedMobileApp(mobile);
	};

	useEffect(() => {
		if (selectedMobileApp === null) {
			changeMobile(mobileInfo[0]);
		}
	}, [selectedMobileApp]);

	return (
		<SelectedMobile.Provider value={selectedMobileApp}>
			<Show
				when={mobileInfo && mobileInfo.length !== 0}
				fallback={
					<EmptyScreenView
						buttonText="Add Mobile"
						title={"There's no data to display here"}
						info={'Start by clicking on the button below'}
						event={openModal}
					/>
				}>
				<>
					<div className="brightness variant-1"></div>
					<div className="brightness variant-2"></div>
					<div className="brightness variant-3"></div>

					<section className="left">
						<div className="add-button">
							<PrimaryButton text="ADD MOBILE APP" click={openModal} />
						</div>

						<div className="list">
							{mobileInfo?.map((mobile: MobileApp, i: number) => (
								<div
									key={mobileKeys[i]}
									className="app-info"
									onClick={(e: React.FormEvent) => {
										e.preventDefault();
										selectMobile(mobile);
									}}>
									<>
										<AppCard
											isActive={isCurrentMobileSelected(mobile.id)}
											onDone={(id: string) => {
												refresh();
												setSelectedMobileApp(null);
											}}
											type="mobile"
											id={mobile.id}
											appMedia={mobile.appMedia}
											appDesc={mobile.appDesc}
											appReviews={mobile.appReviews}
											appRank={mobile.appRank}
											appDeveloper={mobile.appDeveloper}
											name={mobile.appName}
										/>
									</>
								</div>
							))}
						</div>
					</section>

					<section className="right">
						<Show when={isNotNull()}>
							<MobileSelectedDetails />
						</Show>
					</section>
				</>
			</Show>
		</SelectedMobile.Provider>
	);
};
