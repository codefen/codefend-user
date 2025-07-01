import { TABLE_KEYS } from '@/app/constants/app-texts';
import { memo, type ChangeEvent, type FC, type MouseEvent } from 'react';
import TableCellV3 from './TableCellV3';
import { ThreeDotsIcon } from '@icons';
import type { TableLabelRowProps } from './types';

const TableLabelRowComponent: FC<TableLabelRowProps> = ({
  itemDisable,
  row,
  nextRow,
  columns,
  handleChecked,
  selectedItems,
  onContextMenu,
  enableContextMenu,
  onThreeDotsClick,
}) => {
  const ID = row[TABLE_KEYS.ID];

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
    <label className={`item label ${itemDisable}`} data-id={ID} onContextMenu={handleContextMenu}>
      <div className="item-cell" style={{ '--cell-expand': '2.5%' } as any}>
        <input
          id={`t-row-${ID}`}
          type="checkbox"
          name="t-row"
          value={ID}
          className="codefend-checkbox"
          checked={selectedItems.includes(ID)}
          onChange={handleChecked}
        />
      </div>
      <TableCellV3 row={row} nextRow={nextRow} columns={columns} />
      {enableContextMenu && (
        <div className="three-dots-button" onClick={handleThreeDotsClick}>
          <ThreeDotsIcon />
        </div>
      )}
    </label>
  );
};

export default memo(TableLabelRowComponent);
