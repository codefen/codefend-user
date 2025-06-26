import { type FC, type MouseEvent } from 'react';
import TableCellV3 from './TableCellV3';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import { ThreeDotsIcon } from '@icons';
import type { TableAnchorRowProps } from './types';

const TableAnchorRow: FC<TableAnchorRowProps> = ({
  itemDisable,
  row,
  nextRow,
  columns,
  urlNav = '',
  onContextMenu,
  enableContextMenu,
  onThreeDotsClick,
}) => {
  const needUrl = !urlNav ? 'item-with-out-action' : '';

  const handleContextMenu = (e: MouseEvent) => {
    if (onContextMenu) {
      onContextMenu(e, row);
    }
  };

  const handleThreeDotsClick = (e: MouseEvent) => {
    if (onThreeDotsClick) {
      onThreeDotsClick(e, row);
    }
  };

  return (
    <a
      data-id={row[TABLE_KEYS.ID]}
      className={`item ${itemDisable} ${needUrl}`}
      href={urlNav ? `${urlNav}${row[TABLE_KEYS.ID]}` : ''}
      onContextMenu={handleContextMenu}>
      <TableCellV3 row={row} nextRow={nextRow} columns={columns} />
      {enableContextMenu && (
        <div className="three-dots-button" onClick={handleThreeDotsClick}>
          <ThreeDotsIcon />
        </div>
      )}
    </a>
  );
};

export default TableAnchorRow;
