import { useEffect, type FC } from 'react';
import {
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
	});

	const profileMedia = providerProfile
		? `data:image/png;base64, ${providerProfile.profile_media}`
		: undefined;
	const providerName = `${providerProfile ? providerProfile.fname : ' Loading...'} ${providerProfile ? providerProfile.lname : ''}`;
	const headLine = `${providerProfile ? providerProfile.headline : ' . . .'}`;
	const memberTime = providerProfile
		? formatToMonthYear(providerProfile.creacion)
		: '...';
	const memberLocation = `${providerProfile && providerProfile.pais}, ${providerProfile && providerProfile.pais_provincia}, ${providerProfile && providerProfile.pais_ciudad}`;
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
					<IconTextPairs
						icon={<VerificationIcon />}
						className="provider-verification">
						{true ? (
							<p>
								<span className="highlight">Deal confidence</span>{' '}
								address & identity verified
							</p>
						) : (
							''
						)}
					</IconTextPairs>
					<div className="provider-info-wrapper">
						<div className="provider-finish-audit">
							<span className="audit-count">{0}</span>
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
									{0}
								</span>
								<span className="score-review">
									{0} reviews <StarRating rating={4.5} />
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
