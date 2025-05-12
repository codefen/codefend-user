import { useEffect, useState, type FC } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { naturalTime } from '@utils/helper';
import Tablev3 from '@table/v3/Tablev3';

interface SnPreviousSearchesProps {
  isLoading: boolean;
  previousSearches: any[];
}

export const previousSearchesColumns: ColumnTableV3[] = [
  {
    header: 'date',
    key: 'creacion',
    styles: 'item-cell-sns-1',
    weight: '34%',
    render: val => (val ? naturalTime(val) : '--/--/--'),
  },
  {
    header: 'class',
    key: 'class',
    styles: 'item-cell-sns-2',
    weight: '27%',
    render: val => val || '',
  },
  {
    header: 'keywords',
    key: 'query',
    styles: 'item-cell-sns-3',
    weight: '39%',
    render: val => val || '',
  },
];

function parseHistory(data: any[]) {
  return data.map(item => {
    const text = item.info || item.informacion || '';

    // Extraer "queries:" y "class:" usando expresiones regulares
    const queryMatch = text.match(/queries:\s*([^,]+)/);
    const classMatch = text.match(/class:\s*([^\s,]+)/);

    return {
      query: queryMatch ? queryMatch[1].trim() : null,
      class: classMatch ? classMatch[1].trim() : null,
      creacion: item.creacion || null,
      user_id: item.user_id || null,
      id: item.id || null,
    };
  });
}

const SnPreviousSearches: FC<SnPreviousSearchesProps> = ({ isLoading, previousSearches }) => {
  const safelyPreviousSearches = () => (Array.isArray(previousSearches) ? previousSearches : []);
  const [parsedPreviousSearches, setParsedPreviousSearches] = useState<any[]>([]);

  useEffect(() => {
    setParsedPreviousSearches(parseHistory(previousSearches));
  }, [previousSearches]);
  return (
    <div className="card title previous-searches">
      <div className="header">Previous Searches</div>
      <Tablev3
        columns={previousSearchesColumns}
        rows={parsedPreviousSearches}
        showRows={true}
        initialSort={Sort.desc}
        initialOrder="creacion"
      />
    </div>
  );
};

export default SnPreviousSearches;
