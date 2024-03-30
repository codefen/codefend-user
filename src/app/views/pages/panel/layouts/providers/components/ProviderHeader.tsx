import { useEffect, type FC } from 'react';
import {
	CircleAskIcon,
	IconTextPairs,
	LocationIcon,
	ProfileMedia,
	StarRating,
	VerificationIcon,
} from '../../../../../components';
import { formatToMonthYear, useProviderProfile } from '../../../../../../data';

export const ProviderHeader: FC = () => {
	const { providerProfile, refetch } = useProviderProfile();

	useEffect(() => {
		if (!providerProfile) {
			refetch();
		}
	}, []);

	const profileMedia = providerProfile
		? `data:image/png;base64, ${providerProfile.profile_media}`
		: undefined;
	const providerName = `${providerProfile ? providerProfile.fname : ' Loading...'} ${providerProfile ? providerProfile.lname : ''}`;
	const headLine = `${providerProfile ? providerProfile.headline : ' . . .'}`;
	const memberTime = providerProfile
		? formatToMonthYear(providerProfile.creacion)
		: '...';
	const memberLocation = `${providerProfile && providerProfile.pais}, ${providerProfile && providerProfile.pais_provincia}, ${providerProfile && providerProfile.pais_ciudad}`;

	console.log({ ver: providerProfile?.id_verified });
	return (
		<div className="provider-header">
			{/*<div className="provider-banner-container">
				<img
					className="provider-banner"
					src={bannerImg}
					alt="banner"
					aria-label="provider banner"
				/>
			</div>*/}
			<ProfileMedia
				src={`${profileMedia ? profileMedia : '/util/default-profilemedia.webp'}`}
				size="110px"
				top="8%"
				left="4rem"
			/>

			<div className="provider-header-content">
				<div className="provider-main-info">
					<h3>{providerName}</h3>
					<h4>{headLine}</h4>
					<span>Member since {memberTime}</span>
				</div>

				<div className="provider-extra-info">
					{!Boolean(providerProfile?.id_verified) ? (
						<IconTextPairs
							icon={<VerificationIcon />}
							className={`provider-verification verified`}>
							<p>
								<span className="highlight">Deal confidence</span>{' '}
								address & identity verified
							</p>
						</IconTextPairs>
					) : (
						<IconTextPairs
							icon={<CircleAskIcon />}
							className={`provider-verification not-verified`}>
							<p>
								<span className="highlight">
									Uncertainty in the agreement
								</span>{' '}
								unverified address and identity
							</p>
						</IconTextPairs>
					)}
					<div className="provider-info-wrapper">
						<div className="provider-finish-audit">
							<span className="audit-count">
								{providerProfile?.finished_orders || 0}
							</span>
							<span className="audit-title">Finished Audits</span>
						</div>
						<div className="provider-score-local">
							<IconTextPairs
								icon={<LocationIcon />}
								className="provider-local"
								title={memberLocation}>
								{memberLocation}
							</IconTextPairs>

							<span className="provider-score">
								<span className="score-info">
									<b>score: </b>
									{providerProfile?.score || 0}
								</span>
								<span className="score-review">
									{providerProfile?.reviews_final || 0} reviews{' '}
									<StarRating rating={providerProfile?.score} />
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
