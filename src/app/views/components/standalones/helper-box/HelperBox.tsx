import { type FC } from 'react';
import { CloseIcon, SimpleRightArrowIcon } from '../..';
import {
	Position,
	type HelperBoxProps,
	type CoordsCssVariable,
} from '../../../../data';
import './helperbox.scss';

export const HelperBox: FC<HelperBoxProps> = ({
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
