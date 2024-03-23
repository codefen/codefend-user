import React from 'react';
import './helperbox.scss';
import { CloseIcon, SimpleRightArrowIcon } from '../..';

export interface HelperBoxCords {
	right: string;
	left: string;
	top: string;
	bottom: string;
}

export interface CoordsCssVariable extends React.CSSProperties {
	['--coord-top']: string;
	['--coord-bottom']: string;
	['--coord-left']: string;
	['--coord-right']: string;
	['--arrow-X']: string;
	['--arrow-Y']: string;
	['--arrow-color']: string;
}

export enum Position {
	TOP = 'top',
	BOTTOM = 'bottom',
	LEFT = 'left',
	RIGHT = 'right',
}

export interface ArrowPosition {
	position: Position;
	coordX?: string /* Move position for top and bottom */;
	coordY?: string /* Move the position to left and right */;
	color?: string;
}

export interface HelperBoxProps {
	icon?: JSX.Element;
	title: string;
	text: string;
	highlight: string;
	coords: HelperBoxCords;
	arrow: ArrowPosition;
}

export const HelperBox: React.FC<HelperBoxProps> = ({
	icon,
	title,
	text,
	highlight,
	coords,
	arrow,
}) => {
	const { position, coordX = '50%', coordY = '50%', color = '' } = arrow;
	const arrowColors = {
		[Position.TOP]: '#f84747',
		[Position.BOTTOM]: '#cb2222',
		[Position.LEFT]: '#de3434',
		[Position.RIGHT]: '#e13434',
	};
	const defaultArrowColor = color || arrowColors[position];

	const boxStyles: CoordsCssVariable = {
		'--coord-top': `${coords.top}`,
		'--coord-bottom': `${coords.bottom}`,
		'--coord-left': `${coords.left}`,
		'--coord-right': `${coords.right}`,
		'--arrow-X': `${coordX}`,
		'--arrow-Y': `${coordY}`,
		'--arrow-color': `${defaultArrowColor}`,
	};

	return (
		<article className="helper-box" data-arrow={position} style={boxStyles}>
			<header className="header-container">
				<div className="title-container">
					{icon && <span>{icon}</span>}
					<h2>{title}</h2>
				</div>

				<button className="close-btn">
					<CloseIcon isButton />
				</button>
			</header>
			<b>{highlight}</b>
			<p>{text}</p>
			<button className="next-btn">
				Continue <SimpleRightArrowIcon />
			</button>
		</article>
	);
};
