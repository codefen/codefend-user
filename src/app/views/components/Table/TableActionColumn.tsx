import type { TableAction, TableItem } from '@interfaces/table';
import type { FC, FormEvent } from 'react';

interface ActionColumnProps {
  row: Record<string, TableItem>;
  actions: TableAction;
}

const ActionColumn: FC<ActionColumnProps> = ({ row, actions }) => (
  <div className="id action">
    <div className="publish">
      {actions?.icon?.map((i: any, iconIndex: any) => (
        <span
          key={iconIndex}
          className={i?.style}
          onClick={(e: FormEvent) => {
            e.preventDefault();
            e.stopPropagation();
            i.action(row['ID'].value as string);
          }}>
          {typeof i.render === 'function' ? i.render({ extraAttr: row['issue'] }) : i.render}
        </span>
      ))}
    </div>
  </div>
);

export default ActionColumn;
