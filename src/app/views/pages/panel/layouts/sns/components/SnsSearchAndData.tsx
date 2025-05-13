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
            height: '60cqh',
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
          height: '60cqh',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <div
          className="container-no-results"
          style={{
            background: 'white',
            padding: '5rem',
            borderRadius: '4px',
            width: '80%',
            boxShadow: '0 4px 30px rgba(189, 189, 189, 0.12)',
          }}>
          <div className="no-results-icon">
            <i className="fas fa-search" style={{ fontSize: '2rem', color: '#666' }}></i>
          </div>
          <div
            className="no-results-text"
            style={{
              color: '#282828',
              fontWeight: '600',
              fontSize: '1.3rem',
              marginBottom: '2rem',
              textAlign: 'center',
              alignItems: 'center',
            }}>
            No se encontraron resultados para tu búsqueda
          </div>
          <div
            className="no-results-subtext"
            style={{ color: '#999', fontSize: '1.1rem', textAlign: 'center' }}>
            Intenta con otros términos de búsqueda
          </div>
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
      />
    </>
  );
};

export default SnsSearchAndData;
