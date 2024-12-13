import { type FC } from 'react';
import TableCellV3 from './TableCellV3';
import { TABLE_KEYS } from '@/app/constants/app-texts';

interface LabelRowProps {
  itemDisable: string;
  row: any;
  nextRow?: any;
  columns: any;
  urlNav?: string;
}

const TableAnchorRow: FC<LabelRowProps> = ({ itemDisable, row, nextRow, columns, urlNav = '' }) => {
  const needUrl = !urlNav ? 'item-with-out-action' : '';
  return (
    <a
      data-id={row[TABLE_KEYS.ID]}
      className={`item ${itemDisable} ${needUrl}`}
      href={urlNav ? `${urlNav}${row[TABLE_KEYS.ID]}` : ''}>
      <TableCellV3 row={row} nextRow={nextRow} columns={columns} />
    </a>
  );
};

export default TableAnchorRow;
