import type { FC } from 'react';
import {
	IconTextPairs,
	LocationIcon,
	ProfileMedia,
	StarRating,
	VerificationIcon,
} from '../../../../../components';

export interface ProviderHeaderProps {
	bannerImg: string;
	profileMedia: string;
	name: string;
	providerTitle: string;
	memberTime: string;
	isVerified: boolean;
	location: string;
	score: number;
	totalReview: number;
	totalAudits: number;
}

export const ProviderHeader: FC<ProviderHeaderProps> = ({
	bannerImg,
	profileMedia,
	name,
	providerTitle,
	memberTime,
	isVerified,
	location,
	score,
	totalReview,
	totalAudits,
}) => (
	<div className="provider-header">
		<div className="provider-banner-container">
			<img
				className="provider-banner"
				src={bannerImg}
				alt="banner"
				aria-label="provider banner"
			/>
		</div>
		<ProfileMedia borderWhite src={profileMedia} top="12rem" left="2.5rem" />

		<div className="provider-header-content">
			<div className="provider-main-info">
				<h3>{name}</h3>
				<h4>{providerTitle}</h4>
				<span>Member since {memberTime}</span>
			</div>

			<div className="provider-extra-info">
				<IconTextPairs
					icon={<VerificationIcon />}
					className="provider-verification">
					{isVerified ? (
						<p>
							<span className="highlight">Deal confidence</span> address
							& identity verified
						</p>
					) : (
						''
					)}
				</IconTextPairs>
				<div className="provider-info-wrapper">
					<div className="provider-finish-audit">
						<span className="audit-count">{totalAudits}</span>
						<span className="audit-title">Finished Audits</span>
					</div>
					<div className="provider-score-local">
						<IconTextPairs
							icon={<LocationIcon />}
							className="provider-local">
							{location}
						</IconTextPairs>

						<span className="provider-score">
							<span className="score-info">
								<b>score: </b>
								{score}
							</span>
							<span className="score-review">
								{totalReview} reviews <StarRating rating={5} />
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
);
