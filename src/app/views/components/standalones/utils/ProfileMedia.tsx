import type { CSSProperties, FC } from 'react';

interface ProfileMediaProps {
	src: string;
	size?: string;
	borderWhite?: boolean;
	top?: string;
	bottom?: string;
	right?: string;
	left?: string;
}

interface ProfileMediaCssVar extends CSSProperties {
	['--profile-media-size']: string;
	['--profile-media-top']: string;
	['--profile-media-bottom']: string;
	['--profile-media-right']: string;
	['--profile-media-left']: string;
}

export const ProfileMedia: FC<ProfileMediaProps> = ({
	src,
	size = '140px',
	borderWhite,
	top = '0',
	bottom = '0',
	left = '0',
	right = '0',
}) => {
	return (
		<div
			className={`profile-media-container ${borderWhite && 'border-white'}`}
			style={
				{
					'--profile-media-size': size,
					'--profile-media-top': top,
					'--profile-media-bottom': bottom,
					'--profile-media-left': left,
					'--profile-media-right': right,
				} as ProfileMediaCssVar
			}>
			<img
				className="profile-media"
				src={src}
				alt="profile-media"
				aria-label="provider profile media"
			/>
		</div>
	);
};
