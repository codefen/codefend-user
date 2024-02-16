import React from 'react';
import { defaultMobileCloudResourceAsset, useAppCard } from '../../../data';
import {
	CloseIcon,
	ConfirmModal,
	ModalTitleWrapper,
	ModalWrapper,
	Show,
	StarRating,
} from '..';

interface MobileAppCardProps {
	isActive?: boolean;
	onDone?: (state: string) => void;
	isMainNetwork?: string | boolean;
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
}

export const AppCard: React.FC<MobileAppCardProps> = ({
	isActive,
	onDone,
	type,
	name,
	isMainNetwork,
	showDetails,
	cloudProvider,
	isMainGoogleNetwork,

	id,
	appMedia,
	appDesc,
	appRank,
	appReviews,
	appDeveloper,
}) => {
	const {
		showModal,
		viewModal,
		isMobileType,
		isImage,
		isDetails,
		handleDelete,
	} = useAppCard({ type, name, isMainNetwork, showDetails, appMedia });

	return (
		<>
			<ModalTitleWrapper
				isActive={showModal}
				close={() => viewModal(false)}
				headerTitle="Delete mobile app">
				<div
					className="web-modal-wrapper internal-tables disable-border"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<ConfirmModal
						header={`Are you sure to remove ${
							isMobileType ? 'mobile app' : 'cloud app'
						} \n  ${name}, ID ${id}`}
						cancelText="Cancel"
						confirmText="Delete"
						close={() => viewModal(false)}
						action={() => handleDelete(id).finally(() => onDone?.(id))}
					/>
				</div>
			</ModalTitleWrapper>

			<div
				className={`app-card ${!isDetails ? 'app-card-border' : 'pt-5'} ${
					isActive && 'active'
				}`}>
				<Show when={!isDetails}>
					<button
						className="app-delete-btn"
						title={
							isMobileType ? 'Remove mobile app' : 'Remove cloud app'
						}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							viewModal(true);
						}}>
						<CloseIcon isButton />
					</button>
				</Show>

				<div className="app-card-content">
					<div className="app-card-content-img">
						<Show
							when={!isImage || !isMobileType}
							fallback={
								<img
									src={`data:image/png;base64,${appMedia}`}
									alt="mobile-image"
								/>
							}>
							<img
								src={
									Array.from(defaultMobileCloudResourceAsset).includes(
										name,
									)
										? `/codefend/${name}.jpg`
										: `/clouds/${
												cloudProvider
													? `${
															cloudProvider === 'gcp'
																? 'google'
																: cloudProvider
														}.png`
													: 'aws.png'
											}`
								}
								alt="app-image"
							/>
						</Show>
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
							<Show when={isDetails}>
								<>
									<div className="actions">
										<div onClick={() => alert('Add issue')}>
											Add issue
										</div>
										<div onClick={() => alert('Add credential')}>
											Add credential
										</div>
										<div onClick={() => viewModal(true)}>
											Delete resource
										</div>
									</div>
								</>
							</Show>
						</div>
						<div className="app-details text-gray">
							<Show
								when={!isMainGoogleNetwork}
								fallback={
									<>
										<span>
											This is our main GCP network. Please handle
											with care.
										</span>
									</>
								}>
								<>
									<p
										className={`app-details-description ${
											isMobileType ? 'isMobile' : 'notMobile'
										} ${isDetails && 'isDetail'}`}>
										{appDesc ?? ''}
									</p>
									{isMobileType && (
										<>
											<span>{appDeveloper ?? ''}</span>
											<div className="reviews">
												<span>{appRank ?? ''}</span>
												{appReviews && <span>•</span>}
												<span>
													{' '}
													{appReviews
														? `${appReviews} reviews`
														: ''}
												</span>
												{isMobileType && (
													<StarRating
														rating={Number(
															appRank?.replace(',', '.'),
														)}
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
		</>
	);
};
