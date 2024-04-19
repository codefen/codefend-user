import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { AppCard } from '@standalones/AppCard.tsx';
import EmptyScreenView from '@defaults/EmptyScreenView.tsx';
import Show from '@defaults/Show.tsx';
import { generateIDArray } from '@utils/helper.ts';
import { type MobileApp } from '@interfaces/panel.ts';
import {
	useSelectMobileCloudApp,
	type SelectMobileCloudApp,
} from '@stores/mobileCloudApp.store.ts';
import { MobileSelectedDetails } from './MobileSelectedDetails.tsx';

interface MobileApplicationProps {
	openModal: () => void;
	mobileInfo: MobileApp[];
	isLoading: boolean;
}

export const MobileApplication: FC<MobileApplicationProps> = ({
	openModal,
	mobileInfo,
}) => {
	const { isNotNull, appSelected, isCurrentSelected, updateSelected } =
		useSelectMobileCloudApp((state: SelectMobileCloudApp) => state);

	const [term, setTerm] = useState('');

	const selectMobile = (mobile: MobileApp) => {
		if (isNotNull() && isCurrentSelected(mobile.id)) return;

		updateSelected(mobile);
	};

	useEffect(() => {
		if (appSelected === null) {
			updateSelected(mobileInfo[0]);
		}
	}, [appSelected]);

	const getMobileInfo = useCallback(
		() =>
			mobileInfo.filter((app: MobileApp) =>
				app.appName.toLowerCase().includes(term.toLowerCase()),
			),
		[term],
	);

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
						{getMobileInfo().map((mobile: MobileApp, i: number) => (
							<div
								key={`mob-${i}`}
								className="app-info"
								onClick={(e: React.FormEvent) => {
									e.preventDefault();
									selectMobile(mobile);
								}}>
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
