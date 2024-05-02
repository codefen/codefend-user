import { type FC } from 'react';
import {
	cleanHTML,
	cleanReview,
	defaultMobileCloudResourceAsset,
	useAppCard,
} from '../../../data';
import { BugIcon, Show, StarRating } from '..';
import { useLocation, useNavigate } from 'react-router';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { useRemoveAppStore } from '@stores/mobileCloudRemove.store';

interface MobileAppCardProps {
	isActive?: boolean;
	showDetails?: boolean;
	cloudProvider?: any;
	isMainGoogleNetwork?: string | boolean;
	appReviews?: string;
	appRank?: string;
	appDeveloper?: string;
	type?: string;

	id: string;
	name: string;
	appMedia: string;
	appDesc: string;
	openReport?: () => void;
	issueCount?: number;
	activeViewCount?: boolean;
}

export const AppCard: FC<MobileAppCardProps> = ({
	isActive,
	type,
	name,
	showDetails,
	cloudProvider,
	isMainGoogleNetwork,

	id,
	appMedia,
	appDesc,
	appRank,
	appReviews,
	appDeveloper,
	openReport,
	issueCount,
	activeViewCount,
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAdmin, isNormalUser, isProvider } = useUserRole();
	const { isImage, isMobileType, isDetails } = useAppCard({
		type,
		showDetails,
		appMedia,
	});

	const { setIsOpen } = useRemoveAppStore((state) => state);

	const handleClick = () => {
		if (isAdmin() || isProvider())
			navigate(`/issues/create/${isMobileType ? 'mobile' : 'cloud'}/${id}`, {
				state: { redirect: location.pathname },
			});
	};

	const handleDeleteResource = () => setIsOpen(true);

	// Función de utilidad para generar clases condicionales
	const generateCardClasses = () => {
		let classes = 'app-card';
		if (!isDetails) {
			classes += ' app-card-border';
		} else {
			classes += ' app-card-pt';
		}
		if (isActive) {
			classes += ' active';
		}
		return classes;
	};

	// Función para renderizar la imagen basada en las condiciones
	const MemoizedRenderImage = () => {
		return !isImage || !isMobileType ? (
			<img
				src={
					Array.from(defaultMobileCloudResourceAsset).includes(name)
						? `/codefend/${name}.jpg`
						: `/clouds/${cloudProvider ? `${cloudProvider === 'gcp' ? 'google' : cloudProvider}.png` : 'aws.png'}`
				}
				alt="app-image"
				decoding="async"
				loading="lazy"
			/>
		) : (
			<img
				src={`data:image/png;base64,${appMedia}`}
				alt="mobile-image"
				decoding="async"
				loading="lazy"
			/>
		);
	};

	const renderResourceDetail = () => {
		if (isDetails) {
			const activeReport = issueCount !== undefined && issueCount >= 1;
			return (
				<div className="actions">
					<Show when={isAdmin() || isProvider()}>
						<div onClick={handleClick}>Add issue</div>
					</Show>
					<Show when={isAdmin() || isNormalUser()}>
						<div onClick={handleDeleteResource}>Delete resource</div>
					</Show>
					<div
						onClick={openReport}
						className={!activeReport ? 'disable-report-action' : ''}>
						Report
					</div>
				</div>
			);
		} else {
			return <></>;
		}
	};

	return (
		<div className={`${generateCardClasses()}`}>
			<div className="app-card-content">
				<div className="app-card-content-img">
					{<MemoizedRenderImage />}
				</div>
				<div className="app-card-content-body">
					<div className="app-card-title">
						<h3 className={`${isDetails ? 'detail' : 'card-resume'}`}>
							{isMainGoogleNetwork
								? 'main google network'
								: cleanReview(name, true)}
							<Show when={Boolean(activeViewCount)}>
								<div className="view-count-issues">
									-{' '}
									<span className="codefend-text-red inline-flex">
										<BugIcon />
										{issueCount}
									</span>
								</div>
							</Show>
						</h3>
						<Show when={isDetails && !isMobileType}>
							<span className="second-text detail">
								resource id: {id}
							</span>
						</Show>
						{renderResourceDetail()}
					</div>
					<div className="app-details text-gray">
						<Show
							when={!isMainGoogleNetwork}
							fallback={
								<span>
									This is our main GCP network. Please handle with
									care.
								</span>
							}>
							<>
								<p
									className={`app-details-description ${
										isMobileType ? 'isMobile' : 'notMobile'
									} ${isDetails && 'isDetail'}`}
									dangerouslySetInnerHTML={{
										__html: cleanHTML(appDesc ?? ''),
									}}></p>
								{isMobileType && (
									<>
										<span>
											{appDeveloper && appDeveloper !== 'unavailable'
												? appDeveloper
												: ''}
										</span>
										<div className="reviews">
											<span>
												{appRank && appRank !== 'unavailable'
													? appRank
													: ''}
											</span>
											{appReviews && appReviews !== 'unavailable' ? (
												<span>•</span>
											) : null}
											<span>
												{' '}
												{appReviews && appReviews !== 'unavailable'
													? `${appReviews} reviews`
													: ''}
											</span>
											{isMobileType && appRank !== 'unavailable' ? (
												<StarRating
													rating={
														Number(appRank?.replace(',', '.')) ||
														0
													}
												/>
											) : null}
										</div>
									</>
								)}
							</>
						</Show>
					</div>
				</div>
			</div>
		</div>
	);
};
