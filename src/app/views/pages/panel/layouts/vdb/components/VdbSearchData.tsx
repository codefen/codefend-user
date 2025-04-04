import { type FC } from 'react';
import { type ResultsVdbSearchV2 } from '@interfaces/panel';
import { useInitialVdb } from '@moduleHooks/vdb/useVdb';
import { vdbColumns } from '@mocks/defaultData';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import { TableV2 } from '@table/tablev2';
import Show from '@/app/views/components/Show/Show';
import { ScanSearchIcon } from '@icons';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { RiskScore } from '@/app/views/components/utils/RiskScore';

export const VdbSearchData: FC = () => {
  const { vdbResults, refetch, isLoading, searchData, handleChange } = useInitialVdb();

  const dataTable = vdbResults.current.map((data: ResultsVdbSearchV2) => ({
    ID: { value: data.id, style: '' },
    Identifier: { value: data.id, style: 'id' },
    published: { value: data.createdAt, style: 'date' },
    cve: { value: data.entryID, style: 'cve' },
    title: { value: data.title, style: 'vul-title' },
    score: {
      value: <RiskScore riskScore={data.riskScore || '0'} />,
      style: 'vul-score',
    },
    risk: { value: data.riskName, style: 'vul-risk' },
  }));

  return (
    <>
      <div className="search-bar-container">
        <SearchBar
          inputValue={searchData}
          placeHolder="Enter a program name (e.g. Mozilla Firefox)"
          handleChange={handleChange}
          handleSubmit={refetch}
          searchIcon={<ScanSearchIcon isButton />}
        />
      </div>
      <Show when={!isLoading} fallback={<PageLoader />}>
        <div className="vdb-app-info">
          <TableV2
            rowsData={dataTable}
            columns={vdbColumns}
            showRows={!isLoading}
            showEmpty={!Boolean(vdbResults.current.length)}
          />
        </div>
      </Show>
    </>
  );
};
