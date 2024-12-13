import type { CSSProperties, ReactNode } from 'react';

export interface HelperBoxCords {
  right?: number;
  left?: number;
  top?: number;
  bottom?: number;
}

export interface CoordsCssVariable extends CSSProperties {
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
  icon?: ReactNode;
  title: string;
  text: string;
  highlight: string;
  coords: HelperBoxCords;
  arrow: ArrowPosition;

  isFinishStep?: boolean;

  close: () => void;
  next: () => void;
}
