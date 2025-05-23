import { useEffect, type FC } from 'react';
import { IconTextPairs } from '@/app/views/components/utils/IconTextPairs';
import { CircleAskIcon, LocationIcon, VerificationIcon } from '@icons';

import { formatToMonthYear } from '@utils/helper.ts';
import { useProviderProfile } from '@hooks/users/providers/useProviders.ts';
import { ProfileHeader } from '@/app/views/components/profileheader/ProfileHeader';
import { StarRating } from '@/app/views/components/utils/StarRating';

export const ProviderHeader: FC = () => {
  const { providerProfile, refetch, setProvider } = useProviderProfile();

  useEffect(() => {
    if (!providerProfile) {
      refetch();
    }
    return () => setProvider(undefined);
  }, []);

  const profileMedia = providerProfile
    ? `data:image/png;base64, ${providerProfile.profile_media}`
    : undefined;
  const providerName = `${providerProfile ? providerProfile.fname : ' Loading...'} ${providerProfile ? providerProfile.lname : ''}`;
  const headLine = `${providerProfile ? providerProfile.headline : ' . . .'}`;
  const memberTime = providerProfile ? formatToMonthYear(providerProfile.creacion) : '...';
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
      <div className="provider-header-content">
        <ProfileHeader
          profileMedia={profileMedia}
          title={providerName}
          headline={headLine}
          bottomText={`Member since ${memberTime}`}
        />

        <div className="provider-extra-info">
          {Boolean(providerProfile?.id_verified) ? (
            <IconTextPairs icon={<VerificationIcon />} className={`provider-verification verified`}>
              <p>
                <span className="highlight">Deal confidence</span> address & identity verified
              </p>
            </IconTextPairs>
          ) : (
            <IconTextPairs
              icon={<CircleAskIcon />}
              className={`provider-verification not-verified`}>
              <p>
                <span className="highlight">Uncertainty in the agreement</span> unverified address
                and identity
              </p>
            </IconTextPairs>
          )}
          <div className="provider-info-wrapper">
            <div className="stat">
              <div className="value">{providerProfile?.finished_orders || 0}</div>
              <p className="audit-title">Finished Audits</p>
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
