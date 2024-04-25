import { type FC } from 'react';
import {
	cleanHTML,
	defaultMobileCloudResourceAsset,
	useAppCard,
} from '../../../data';
import { Show, StarRating } from '..';
import { useNavigate } from 'react-router';
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
}) => {
	const { isAdmin, isNormalUser } = useUserRole();
	const { isImage, isMobileType, isDetails } = useAppCard({
		type,
		showDetails,
		appMedia,
	});
	const navigate = useNavigate();

	const { setIsOpen } = useRemoveAppStore((state) => state);

	const handleClick = () =>
		navigate(`/issues/create/${isMobileType ? 'mobile' : 'cloud'}/${id}`);

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
			return (
				<div className="actions">
					<div onClick={handleClick}>Add issue</div>
					<Show when={isAdmin() || isNormalUser()}>
						<div onClick={handleDeleteResource}>Delete resource</div>
					</Show>
					<div onClick={openReport}>Report</div>
				</div>
			);
		} else {
			return <></>;
		}
	};

	return (
		<div className={generateCardClasses()}>
			<div className="app-card-content">
				<div className="app-card-content-img">
					{<MemoizedRenderImage />}
				</div>
				<div className="app-card-content-body">
					<div className="app-card-title">
						<h3 className={`${isDetails ? 'detail' : 'card'}`}>
							{isMainGoogleNetwork ? 'main google network' : name}
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
										<span>{appDeveloper ?? ''}</span>
										<div className="reviews">
											<span>{appRank ?? ''}</span>
											{appReviews && <span>•</span>}
											<span>
												{' '}
												{appReviews ? `${appReviews} reviews` : ''}
											</span>
											{isMobileType && (
												<StarRating
													rating={
														Number(appRank?.replace(',', '.')) ||
														0
													}
												/>
											)}
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
