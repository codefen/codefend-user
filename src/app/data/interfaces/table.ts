export enum Sort {
	asc = 'asc',
	desc = 'desc',
}

export interface TableProps {
	rowsData: Record<string, TableItem>[];
	columns: ColumnTable[];
	showRows: boolean;
	showEmpty: boolean;
	tableAction?: TableAction;
	sizeY: number | string;
	sizeX?: number;
	isSmall?: boolean;
	selectItem?: (item: any) => void;
	sort?: Sort;
	initialSelect?: boolean;
	urlNav?: string;
}

export interface ColumnTable {
	name: string;
	value: string;
	style: string;
}

export interface TableItem {
	value: string | JSX.Element;
	style: string;
}

export interface TableAction {
	icon: {
		action: (id: string, type?: any) => void;
		render: JSX.Element;
		style?: string;
	}[];
}