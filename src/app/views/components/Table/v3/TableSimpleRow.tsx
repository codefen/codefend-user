import { type FC, type MouseEvent } from 'react';
import TableCellV3 from './TableCellV3';
import { ThreeDotsIcon } from '@icons';

interface LabelRowProps {
  itemDisable: string;
  row: any;
  nextRow?: any;
  columns: any;
  action?: (val?: any) => void;
  selected?: any;
  selectedKey?: string;
  onContextMenu?: (event: MouseEvent, row: any) => void;
  enableContextMenu?: boolean;
  onThreeDotsClick?: (event: MouseEvent, row: any) => void;
}

const TableSimpleRow: FC<LabelRowProps> = ({
  itemDisable,
  row,
  nextRow,
  columns,
  action,
  selected,
  selectedKey,
  onContextMenu,
  enableContextMenu,
  onThreeDotsClick,
}) => {
  const handleClick = (e: any, item: any) => {
    e.preventDefault();
    if (action) {
      action(item);
    }
  };

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
    <div
      className={`item ${itemDisable} ${!!selected && selected?.[selectedKey as keyof typeof selected] === row?.[selectedKey as keyof typeof row] ? 'selected-item' : ''}`}
      onClick={e => handleClick(e, row)}
      onContextMenu={handleContextMenu}>
      <TableCellV3 row={row} nextRow={nextRow} columns={columns} />
      {enableContextMenu && (
        <div className="three-dots-button" onClick={handleThreeDotsClick}>
          <ThreeDotsIcon />
        </div>
      )}
    </div>
  );
};

export default TableSimpleRow;
