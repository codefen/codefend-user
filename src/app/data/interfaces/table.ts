import type { FC, ReactNode } from "react";

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
	sizeY?: number | string;
	sizeX?: number;
	isSmall?: boolean;
	selectItem?: (item: any) => void;
	sort?: Sort;
	urlNav?: string;
}

export interface ColumnTable {
	name: string;
	value: string;
	style: string;
}

export interface TableItem {
	value: ReactNode | ((props: any ) => ReactNode);
	style: string;
}

export interface TableAction {
	icon: {
		action: (id: string, type?: any) => void;
		render: ReactNode | ((props: any ) => ReactNode);
		extraAttr?: string;
		style?: string;
	}[];
}

export interface ColumnTableV3 {
	header: string;
	key: string;
	styles: string;
	weight: string;
	render: (data: any, next?:any) => ReactNode;
}