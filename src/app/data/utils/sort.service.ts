import { Sort } from '@interfaces/table';

const normalize = (val: any): any => {
  if (typeof val === 'string') {
    return val.trim().toLowerCase();
  }
  return val;
};
export const getValueFromObject = (value: any): any => {
  return value.props?.riskScore || value.props?.country || value.props?.name || value;
};

type CompareFn = (a: any, b: any) => number;

const makeCompareFn = (mult: number, data: any): CompareFn => {
  if (
    typeof data === 'number' ||
    (typeof data === 'string' && !isNaN(parseFloat(data)) && isFinite(Number(data)))
  ) {
    return (a, b) => (a - b) * mult;
  } else if (typeof data === 'string') {
    return (a, b) => normalize(a).localeCompare(normalize(b), 'en', { sensitivity: 'base' }) * mult;
  } else {
    return (a, b) => (a < b ? -1 : a > b ? 1 : 0) * mult;
  }
};

export const compareValues = (firstVal: any, secondVal: any, sort: string): number => {
  let result: number;
  if (typeof firstVal === 'number' && typeof secondVal === 'number') {
    result = firstVal - secondVal;
  } else if (typeof firstVal === 'boolean' && typeof secondVal === 'boolean') {
    result = (firstVal ? 1 : 0) - (secondVal ? 1 : 0);
  } else if (typeof firstVal === 'string' && typeof secondVal === 'string') {
    result = normalize(firstVal).localeCompare(normalize(secondVal), 'en', { sensitivity: 'base' });
  } else {
    result = String(firstVal).localeCompare(String(secondVal));
  }

  return sort === Sort.asc ? result : -result;
};

export const quickSort = <T>(arr: T[] | any[], sortedData: keyof T, sort: Sort): any[] => {
  if (arr.length <= 1) return arr;

  const stack: [number, number][] = [[0, arr.length - 1]];

  while (stack.length) {
    const [left, right] = stack.pop()!;
    if (left >= right) continue;

    const pivotIndex = partition2(arr, left, right, sortedData, sort);

    const leftSize = pivotIndex - 1 - left;
    const rightSize = right - (pivotIndex + 1);

    if (leftSize > rightSize) {
      if (left < pivotIndex - 1) stack.push([left, pivotIndex - 1]);
      if (pivotIndex + 1 < right) stack.push([pivotIndex + 1, right]);
    } else {
      if (pivotIndex + 1 < right) stack.push([pivotIndex + 1, right]);
      if (left < pivotIndex - 1) stack.push([left, pivotIndex - 1]);
    }
  }
  for (const item of arr) {
    if (item?.childs && item.childs.length > 1) {
      item.childs = quickSort(item.childs, sortedData, sort);
    }
  }
  return arr;
};

const partition2 = <T>(
  arr: T[],
  left: number,
  right: number,
  dataSort: keyof T,
  sortDirection: Sort
): number => {
  // Configuramos un multiplicador: 1 para ascendente, -1 para descendente.
  const mult = sortDirection === Sort.asc ? 1 : -1;

  // Seleccionamos el pivote usando median-of-three (micro optimizado inline)
  const mid = Math.floor((left + right) / 2);
  // Cachea los tres valores a comparar:
  let a = arr[left][dataSort],
    b = arr[mid][dataSort],
    c = arr[right][dataSort];

  // Realiza las comparaciones "in-place" (la idea es que la mediana termine en 'mid')
  if ((a < b ? -1 : a > b ? 1 : 0) * mult > 0) {
    // Si a > b según el orden deseado, intercambiar left y mid
    swapInPlace(arr, left, mid);
    a = arr[left][dataSort];
    b = arr[mid][dataSort];
  }
  if ((a < c ? -1 : a > c ? 1 : 0) * mult > 0) {
    swapInPlace(arr, left, right);
    a = arr[left][dataSort];
    c = arr[right][dataSort];
  }
  if ((b < c ? -1 : b > c ? 1 : 0) * mult > 0) {
    swapInPlace(arr, mid, right);
    b = arr[mid][dataSort];
    c = arr[right][dataSort];
  }
  // Usamos el valor mediano, que ahora se encuentra en 'mid'
  const pivotIndex = mid;
  const pivotValue = arr[pivotIndex][dataSort];

  // Mueve el pivote al final
  swapInPlace(arr, pivotIndex, right);

  let storeIndex = left;
  const compareFn = makeCompareFn(mult, arr[0][dataSort]);
  for (let i = left; i < right; i++) {
    // Extrae el valor actual y aplica la comparación inline
    const currentValue = arr[i][dataSort];
    const cmp = compareFn(currentValue, pivotValue);
    if (cmp < 0) {
      swapInPlace(arr, i, storeIndex);
      storeIndex++;
    }
  }
  // Finalmente coloca el pivote en su posición final
  swapInPlace(arr, storeIndex, right);
  return storeIndex;
};

const swapInPlace = <T>(arr: T[], i: number, j: number): void => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const _partition = <T>(
  arr: T[],
  left: number,
  right: number,
  dataSort: keyof T,
  sortDirection: Sort
): number => {
  const pivotIndex = medianOfThree(arr, left, right, dataSort, sortDirection);
  const pivotValue = arr[pivotIndex][dataSort];
  swap(arr, pivotIndex, right);
  let storeIndex = left;
  for (let i = left; i < right; i++) {
    if (compareValues(arr[i][dataSort], pivotValue, sortDirection) < 0) {
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

const medianOfThree = <T>(
  arr: T[],
  left: number,
  right: number,
  dataSort: keyof T,
  sortDirection: Sort
): number => {
  const mid = Math.floor((left + right) / 2);
  if (compareValues(arr[left][dataSort], arr[mid][dataSort], sortDirection) > 0) {
    swap(arr, left, mid);
  }
  if (compareValues(arr[left][dataSort], arr[right][dataSort], sortDirection) > 0) {
    swap(arr, left, right);
  }
  if (compareValues(arr[mid][dataSort], arr[right][dataSort], sortDirection) > 0) {
    swap(arr, mid, right);
  }
  return mid;
};

export const flatten = (resource: any, arr: any[]) => {
  arr.push(resource);
  if (resource?.childs) {
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
