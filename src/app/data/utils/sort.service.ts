import { Sort } from '@interfaces/table';

export const getValueFromObject = (value: any): any => {
	return (
		value.props?.riskScore ||
		value.props?.country ||
		value.props?.name ||
		value
	);
};

export const compareValues = (
	firstVal: any,
	secondVal: any,
	sort: string,
): number => {
	if (sort === Sort.asc) {
		return firstVal < secondVal ? -1 : firstVal > secondVal ? 1 : 0;
	} else {
		return firstVal > secondVal ? -1 : firstVal < secondVal ? 1 : 0;
	}
};

export const quickSort = <T>(
	arr: T[] | any[],
	sortedData: keyof T,
	sort: Sort,
): any[] => {
	if (arr.length <= 1) return arr;

	const stack: [number, number][] = [[0, arr.length - 1]];

	while (stack.length) {
		const [left, right] = stack.pop()!;
		if (left >= right) continue;

		const pivotIndex = partition(arr, left, right, sortedData, sort);

		if (pivotIndex - 1 > left) {
			stack.push([left, pivotIndex - 1]);
		}

		if (pivotIndex + 1 < right) {
			stack.push([pivotIndex + 1, right]);
		}
	}
	for (const item of arr) {
		if (item?.childs && item?.childs.length > 1) {
			item.childs = quickSort(item.childs, sortedData, sort);
		}
	}
	return arr;
};

const partition = <T>(
	arr: T[],
	left: number,
	right: number,
	dataSort: keyof T,
	sortDirection: Sort,
): number => {
	const pivotIndex = Math.floor((left + right) / 2);
    const pivotValue = arr[pivotIndex][dataSort];
    swap(arr, pivotIndex, right);
    let storeIndex = left;
  
    for (let i = left; i < right; i++) {
      const currentValue = arr[i][dataSort];
      if (compareValues(currentValue, pivotValue, sortDirection) < 0) {
        swap(arr, i, storeIndex);
        storeIndex++;
      }
    }

	swap(arr, storeIndex, right);
	return storeIndex;
};

const swap = <T>(arr: T[], i: number, j: number): void => {
	[arr[i], arr[j]] = [arr[j], arr[i]];
};

export const flatten = (resource: any, arr: any[]) => {
	arr.push(resource);
	if (resource.childs) {
		for (const child of resource.childs) {
			flatten(child, arr);
		}
	}
};

export const flattenRows = (rows: any[]): any[] => {
	const flattened: any[] = [];
	for (const resource of rows) {
		flatten(resource, flattened);
	}
	return flattened;
};