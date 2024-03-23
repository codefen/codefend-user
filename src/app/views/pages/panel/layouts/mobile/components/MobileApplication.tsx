import React, { useEffect, useMemo, useState } from 'react';
import { AppCard, EmptyScreenView, Show } from '../../../../../components';
import {
	type MobileApp,
	type SelectMobileCloudApp,
	generateIDArray,
	useSelectMobileCloudApp,
} from '../../../../../../data';
import { MobileSelectedDetails } from './MobileSelectedDetails';

interface MobileApplicationProps {
	openModal: () => void;
	mobileInfo: MobileApp[];
	isLoading: boolean;
}

export const MobileApplication: React.FC<MobileApplicationProps> = ({
	openModal,
	mobileInfo,
}) => {
	const { isNotNull, appSelected, isCurrentSelected, updateSelected } =
		useSelectMobileCloudApp((state: SelectMobileCloudApp) => state);

	const [term, setTerm] = useState('');

	const mobileKeys = useMemo(() => {
		return mobileInfo ? generateIDArray(mobileInfo.length) : [];
	}, [mobileInfo]);

	const selectMobile = (mobile: MobileApp) => {
		if (isNotNull() && isCurrentSelected(mobile.id)) return;

		updateSelected(mobile);
	};

	useEffect(() => {
		if (appSelected === null) {
			updateSelected(mobileInfo[0]);
		}
	}, [appSelected]);

	return (
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
					<div className="card">
						<div className="header">
							<div className="title">
								<span>Mobile Applications</span>
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
						{mobileInfo
							?.filter((app: MobileApp) =>
								app.appName.toLowerCase().includes(term.toLowerCase()),
							)
							.map((mobile: MobileApp, i: number) => (
								<div
									key={mobileKeys[i]}
									className="app-info"
									onClick={(e: React.FormEvent) => {
										e.preventDefault();
										selectMobile(mobile);
									}}>
									<>
										<AppCard
											isActive={isCurrentSelected(mobile.id)}
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
	);
};
