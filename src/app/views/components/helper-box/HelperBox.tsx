import { type FC } from 'react';
import { Position, type HelperBoxProps, type CoordsCssVariable } from '../../../data';
import './helperbox.scss';
import { CloseIcon } from '@icons';
import Show from '@/app/views/components/Show/Show';

export const HelperBox: FC<HelperBoxProps> = ({
  icon,
  title,
  text,
  highlight,
  coords: buttonCoords,
  arrow,
  close,
  next,
  isFinishStep,
}) => {
  const { position, coordX = '50%', coordY = '50%', color = '' } = arrow;
  const arrowColors = {
    [Position.TOP]: '#f84747',
    [Position.BOTTOM]: '#a71818',
    [Position.LEFT]: '#561e1e',
    [Position.RIGHT]: '#a71818',
  };
  const defaultArrowColor = color || arrowColors[position];

  const boxStyles: CoordsCssVariable = {
    '--coord-top': `${buttonCoords?.top + 'px' || '0%'}`,
    '--coord-bottom': `${buttonCoords?.bottom || '0%'}`,
    '--coord-left': `${buttonCoords?.left + 'px' || '0%'}`,
    '--coord-right': `${buttonCoords?.right || '0%'}`,
    '--arrow-X': `${coordX}`,
    '--arrow-Y': `${coordY}`,
    '--arrow-color': `${defaultArrowColor}`,
  };

  return (
    <div className="helper-box" data-arrow={position} style={boxStyles}>
      <header className="header-container">
        <div className="title-container">
          {icon && <span>{icon}</span>}
          <h2>{title}</h2>
        </div>

        <button className="close-btn" onClick={close}>
          <CloseIcon isButton />
        </button>
      </header>
      <div className="content">
        <b>{highlight}</b>
        <p>{text}</p>
        <button className="btn next-btn" onClick={next}>
          <Show when={!isFinishStep} fallback={'Finish guide'}>
            Continue tour
          </Show>
        </button>
      </div>
    </div>
  );
};
