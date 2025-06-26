import Show from '@/app/views/components/Show/Show';
import type { ColumnTable, TableItem } from '@interfaces/table';
import { formatDate } from '@utils/helper';
import { Fragment, PureComponent, type ReactNode } from 'react';
import ActionColumn from './TableActionColumn';

interface RowProps {
  row: Record<string, TableItem>;
  rowIndex: number;
  columns: ColumnTable[];
  urlNav?: string;
  selectedField: string;
  handleClick: (e: any, key: string, rowId: any, issueCount?: string | number) => void;
  isActiveAction: boolean;
  tableAction?: any;
}

const rowsID2 = (i: number, ID: string) => `row-i-${i}-${ID}`;

class Row extends PureComponent<RowProps> {
  override render() {
    const {
      row,
      rowIndex,
      columns,
      urlNav,
      selectedField,
      handleClick,
      isActiveAction,
      tableAction,
    } = this.props;
    return (
      <Fragment>
        <a
          className={`item ${!urlNav ? 'item-with-out-action' : ''} ${row['issue'] && Number(row['issue']?.value as number) <= 0 ? 'item-disabled' : ''} ${
            selectedField === rowsID2(rowIndex, row['ID'].value as string) ? 'left-marked' : ''
          }`}
          href={urlNav ? `${urlNav}${row['ID'].value}` : ''}
          onClick={e =>
            handleClick(
              e,
              rowsID2(rowIndex, row['ID'].value as string),
              row['ID'].value,
              row['issue'] ? Number(row['issue'].value) : undefined
            )
          }>
          {columns.map((column, i) => (
            <Fragment key={i}>
              {column.name !== 'childs' && (
                <div className={row[column.name as keyof typeof row]?.style}>
                  <div className="publish">
                    {!column.name.startsWith('publish')
                      ? (row[column.name as keyof typeof row]?.value as ReactNode)
                      : formatDate(String(row[column.name as keyof typeof row]?.value))}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
          <Show when={isActiveAction}>
            <ActionColumn actions={tableAction!} row={row} />
          </Show>
        </a>
        {row['childs'] && typeof row['childs'].value === 'function'
          ? row['childs'].value({ urlNav, handleClick, selectedField })!
          : ''}
      </Fragment>
    );
  }
}

export default Row;
