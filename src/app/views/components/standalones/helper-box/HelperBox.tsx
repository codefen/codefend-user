import { type FC } from 'react';
import { CloseIcon, Show, SimpleRightArrowIcon } from '../..';
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
	coords: buttonCoords, // Renombramos coords a buttonCoords
	arrow,
	close,
	next,
	isFinishStep,
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
	  '--coord-top': `${buttonCoords?.top + 'px' || '0%'}`, // Usamos las coordenadas dinámicas
	  '--coord-bottom': `${buttonCoords?.bottom || '0%'}`, // Usamos las coordenadas dinámicas
	  '--coord-left': `${buttonCoords?.left + 'px' || '0%'}`, // Usamos las coordenadas dinámicas
	  '--coord-right': `${buttonCoords?.right || '0%'}`, // Usamos las coordenadas dinámicas
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
  
		  <button className="close-btn" onClick={close}>
			<CloseIcon isButton />
		  </button>
		</header>
		<b>{highlight}</b>
		<p>{text}</p>
		<button className="next-btn" onClick={next}>
		  <Show when={!isFinishStep} fallback={'Finish guide'}>
			Continue <SimpleRightArrowIcon />
		  </Show>
		</button>
	  </article>
	);
  };