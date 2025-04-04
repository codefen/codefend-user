import { type FC } from 'react';
import TableCellV3 from './TableCellV3';

interface LabelRowProps {
  itemDisable: string;
  row: any;
  nextRow?: any;
  columns: any;
  action?: (val?: any) => void;
  selected?: any;
  selectedKey?: string;
}

const TableSimpleRow: FC<LabelRowProps> = ({
  itemDisable,
  row,
  nextRow,
  columns,
  action,
  selected,
  selectedKey,
}) => {
  const handleClick = (e: any, item: any) => {
    e.preventDefault();
    if (action) {
      action(item);
    }
  };

  return (
    <div
      className={`item ${itemDisable} ${!!selected && selected?.[selectedKey as keyof typeof selected] === row?.[selectedKey as keyof typeof row] ? 'selected-item' : ''}`}
      onClick={e => handleClick(e, row)}>
      <TableCellV3 row={row} nextRow={nextRow} columns={columns} />
    </div>
  );
};

export default TableSimpleRow;
