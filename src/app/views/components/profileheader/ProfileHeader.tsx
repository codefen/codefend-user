import type { FC } from 'react';
import './profileheader.scss';
import { ProfileMedia } from '@/app/views/components/utils/ProfileMedia';

export interface ProfileHeaderProps {
  profileMedia?: string;
  title: string;
  headline: string;
  bottomText: string;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  profileMedia,
  title,
  headline,
  bottomText,
}) => (
  <>
    <ProfileMedia
      src={`${profileMedia ? profileMedia : '/util/default-profilemedia.webp'}`}
      size="110px"
      top="8%"
      left="4rem"
    />
    <div className="provider-main-info">
      <h3>{title}</h3>
      <h4>{headline}</h4>
      <span>{bottomText}</span>
    </div>
  </>
);
