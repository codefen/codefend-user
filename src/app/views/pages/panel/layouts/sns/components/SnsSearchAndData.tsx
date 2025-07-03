import { type FC, useEffect, type ChangeEvent, type FormEvent, useState } from 'react';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import Masonry from 'react-masonry-css';
import { useSns } from '@moduleHooks/sns/useSns.ts';
import useModal from '#commonHooks/useModal';
import { SnsLeakedDataModal } from '@/app/views/pages/panel/layouts/sns/components/SnsLeakedDataModal';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import SnsCardTitle from './SnsCardTitle';
import Show from '@/app/views/components/Show/Show';
import { SearchBarContainer } from '@/app/views/pages/panel/layouts/sns/components/SearchBarContainer';
import { IntelCard } from '@/app/views/pages/panel/layouts/sns/components/IntelCard';
import { useLeakedData } from '@moduleHooks/sns/useLeakedData';
import type { SearchOptions } from '@interfaces/snsTypes';

const SEARCH_OPTIONS: SearchOptions = {
  _domain: 'domain',
  email: 'email',
  username: 'username',
  password: 'password',
  name: 'full name',
  hash: 'hash',
  lastip: 'lastip',
};

const SnsSearchAndData: FC<{ refetch: () => void }> = ({ refetch }) => {
  const {
    searchClass,
    searchData,
    isLoading,
    intelData,
    setSearchClass,
    setSearchData,
    getUserdata,
    handleSearch,
    limitReached,
    updateCompany,
  } = useSns();
  const [hasSearched, setHasSearched] = useState(false);
  const { leaked, leakedType, showModal, handleOpenLeakedModal, handleCloseLeakedModal } =
    useLeakedData();

  useEffect(() => {
    if (!getUserdata()) return;
    if (searchData) {
      setSearchData(searchData);
      handleSearch();
    }
    if (searchClass && searchData) handleSearch();
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    handleSearch()?.then(() => {
      refetch();
    });
  };

  const selectBarOptions = {
    options: SEARCH_OPTIONS,
    placeHolder: '',
    value: searchClass,
    change: (e: ChangeEvent<HTMLSelectElement>) => setSearchClass(e.target.value),
    defaultSelectOption: 'email',
  };

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100cqh - calc(63px + 1.2rem))',
            flexDirection: 'column',
            gap: '1rem',
          }}>
          <div>
            <SnsCardTitle arrow="down" />
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100cqh - calc(63px + 1.2rem))',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <div className="no-results-text" style={{}}>
          <p>No results found. Please try a different search.</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <SearchBarContainer
        searchData={searchData}
        setSearchData={setSearchData}
        handleSubmit={handleSubmit}
        selectBarOptions={selectBarOptions}
        isDisabled={!searchData}
      />

      <Show when={!isLoading} fallback={<PageLoader />}>
        <div className="content" style={{ marginBottom: '1.2rem', height: '100%' }}>
          {intelData.length === 0 ? (
            renderEmptyState()
          ) : (
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {intelData.map((intel, index) => (
                <IntelCard key={index} intel={intel} onOpenLeakedModal={handleOpenLeakedModal} />
              ))}
            </Masonry>
          )}
        </div>
      </Show>

      <SnsLeakedDataModal
        type={leakedType}
        isActive={showModal}
        close={handleCloseLeakedModal}
        leaked={leaked}
        searchClass={searchClass}
        limitReached={limitReached}
        updateCompany={updateCompany}
      />
    </>
  );
};

export default SnsSearchAndData;
