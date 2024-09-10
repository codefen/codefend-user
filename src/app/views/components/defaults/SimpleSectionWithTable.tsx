import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import { TableV2 } from '@table/tablev2';
import type { FC, ReactNode } from 'react';
import { Sort, type ColumnTable, type TableItem } from '@interfaces/table';

interface SimpleSectionWithTableProps {
  title: string;
  icon?: ReactNode;
  cardType?: string;
  columns: ColumnTable[];
  rows: Record<string, TableItem>[];
  isLoading?: boolean;
}

export const SimpleSectionWithTable: FC<SimpleSectionWithTableProps> = ({
  title,
  icon,
  rows,
  columns,
  isLoading,
  cardType,
}) => {
  const selectIcon = icon ? icon : <GlobeWebIcon />;
  return (
    <div className={`card ${cardType && cardType}`}>
      <SimpleSection header={title} icon={selectIcon}>
        <TableV2
          columns={columns}
          rowsData={rows}
          showRows={!isLoading}
          showEmpty={!isLoading && !Boolean(rows.length)}
          sort={Sort.asc}
        />
      </SimpleSection>
    </div>
  );
};
