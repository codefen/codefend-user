// Test específico para 1 solo padre con muchos childs
const testSingleParentData = [
  {
    ID: { value: '1' },
    name: { value: 'Parent' },
    childs: [
      { ID: { value: '1-5' }, name: { value: 'Eve' } },
      { ID: { value: '1-2' }, name: { value: 'Bob' } },
      { ID: { value: '1-4' }, name: { value: 'David' } },
      { ID: { value: '1-1' }, name: { value: 'Alice' } },
      { ID: { value: '1-3' }, name: { value: 'Charlie' } },
    ],
  },
];

// Función de sorting simplificada para test
const quickSort = (arr, dataSort, sortDirection) => {
  console.log(`🔍 quickSort llamado con ${arr.length} elementos`);

  if (arr.length <= 1) {
    console.log(`⚠️ Array tiene ${arr.length} elementos, retornando sin ordenar`);
    // IMPORTANTE: Aún necesitamos ordenar los childs incluso si el array principal no necesita ordenarse
    for (const item of arr) {
      if (item?.childs && Array.isArray(item.childs) && item.childs.length > 0) {
        console.log(`🔄 Ordenando ${item.childs.length} childs recursivamente`);
        item.childs = quickSort(item.childs, dataSort, sortDirection);
      }
    }
    return arr;
  }

  const stack = [];
  let left = 0;
  let right = arr.length - 1;

  const auxArr = [...arr];

  stack.push(left, right);

  while (stack.length) {
    right = stack.pop();
    left = stack.pop();

    const pivotIndex = partition(auxArr, left, right, dataSort, sortDirection);

    if (left < pivotIndex - 1) {
      stack.push(left, pivotIndex - 1);
    }

    if (pivotIndex + 1 < right) {
      stack.push(pivotIndex + 1, right);
    }
  }

  // Ordenar recursivamente los childs si existen
  for (const item of auxArr) {
    if (item?.childs && Array.isArray(item.childs) && item.childs.length > 0) {
      console.log(`🔄 Ordenando ${item.childs.length} childs recursivamente`);
      item.childs = quickSort(item.childs, dataSort, sortDirection);
    }
  }

  return auxArr;
};

const partition = (arr, left, right, dataSort, sortDirection) => {
  const pivotValue = arr[right][dataSort]?.value;
  let pivotIndex = left;

  for (let i = left; i < right; i++) {
    const aValue = arr[i][dataSort]?.value;
    if (compareValues(aValue, pivotValue, sortDirection) < 0) {
      swap(arr, i, pivotIndex);
      pivotIndex++;
    }
  }

  swap(arr, pivotIndex, right);
  return pivotIndex;
};

const compareValues = (a, b, sortDirection) => {
  if (typeof a === 'string' && typeof b === 'string') {
    const result = a.localeCompare(b);
    return sortDirection === 'asc' ? result : -result;
  }
  return sortDirection === 'asc' ? (a < b ? -1 : a > b ? 1 : 0) : a > b ? -1 : a < b ? 1 : 0;
};

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

// Test
console.log('Datos originales (1 padre con 5 childs):');
console.log(JSON.stringify(testSingleParentData, null, 2));

const sortedData = quickSort(testSingleParentData, 'name', 'asc');

console.log('\nDatos ordenados (ascendente):');
console.log(JSON.stringify(sortedData, null, 2));

// Verificar que los childs están ordenados
console.log('\nVerificación de childs ordenados:');
sortedData.forEach((item, index) => {
  console.log(`Item ${index + 1} (${item.name.value}):`);
  if (item.childs) {
    console.log(`  Total childs: ${item.childs.length}`);
    item.childs.forEach((child, childIndex) => {
      console.log(`  Child ${childIndex + 1}: ${child.name.value} (ID: ${child.ID.value})`);
    });
  }
});

// Verificar que están realmente ordenados alfabéticamente
console.log('\nVerificación de orden alfabético:');
if (sortedData[0]?.childs) {
  const childNames = sortedData[0].childs.map(child => child.name.value);
  console.log('Nombres de childs:', childNames);

  const isOrdered = childNames.every((name, index) => {
    if (index === 0) return true;
    return name >= childNames[index - 1];
  });

  console.log('¿Están ordenados alfabéticamente?', isOrdered ? '✅ SÍ' : '❌ NO');
}
