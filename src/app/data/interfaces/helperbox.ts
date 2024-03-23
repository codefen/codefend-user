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