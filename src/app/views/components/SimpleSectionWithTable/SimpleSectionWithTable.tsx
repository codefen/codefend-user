import { GlobeWebIcon } from '@icons';
import type { FC, ReactNode } from 'react';
import { Sort, type ColumnTable, type ColumnTableV3, type TableItem } from '@interfaces/table';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import Tablev3 from '@table/v3/Tablev3';

interface SimpleSectionWithTableProps {
  title: string;
  icon?: ReactNode;
  cardType?: string;
  columns: ColumnTableV3[];
  rows: any[];
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
        <Tablev3 columns={columns} rows={rows} showRows={!isLoading} initialSort={Sort.asc} />
      </SimpleSection>
    </div>
  );
};
