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
import { AnimatePresence, motion } from 'framer-motion';

const SEARCH_OPTIONS: SearchOptions = {
  _domain: 'domain',
  email: 'email',
  username: 'username',
  password: 'password',
  name: 'full name',
  hash: 'hash',
  lastip: 'lastip',
  unknown: 'unknown',
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
  // Versión de animación para controlar transiciones solo al enviar búsqueda
  const [animVersion, setAnimVersion] = useState(0);
  const { leaked, leakedType, showModal, handleOpenLeakedModal, handleCloseLeakedModal } =
    useLeakedData();

  useEffect(() => {
    if (!getUserdata()) return;
    if (searchData) {
      setSearchData(searchData);
      handleSearch();
      setHasSearched(true);
      setAnimVersion(v => v + 1);
    }
    if (searchClass && searchData) handleSearch();
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    setAnimVersion(v => v + 1);
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
        <div className="sns-empty-state">
          <SnsCardTitle arrow="down" />
        </div>
      );
    }

    return (
      <div className="sns-empty-state">
        <div className="no-results-text">
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
        isDisabled={!searchData || searchClass === 'unknown'}
      />

      <Show when={!isLoading} fallback={<PageLoader />}>
        <div className="content sns-results">
          <AnimatePresence mode="wait">
            {intelData.length === 0 ? (
              <motion.div
                key={"empty-" + animVersion}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ width: '100%' }}
              >
                {renderEmptyState()}
              </motion.div>
            ) : (
              <motion.div
                key={"results-" + animVersion}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ width: '100%' }}
              >
                {intelData.length === 1 ? (
                  <IntelCard intel={intelData[0]} onOpenLeakedModal={handleOpenLeakedModal} refetch={refetch} />
                ) : (
                  <Masonry
                    breakpointCols={2}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    {intelData.map((intel, index) => (
                      <IntelCard key={index} intel={intel} onOpenLeakedModal={handleOpenLeakedModal} refetch={refetch} />
                    ))}
                  </Masonry>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
