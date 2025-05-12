import { type FC, useEffect, type ChangeEvent, type FormEvent, useState } from 'react';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import { ScanSearchIcon } from '@icons';
import Masonry from 'react-masonry-css';
import { useSns } from '@moduleHooks/sns/useSns.ts';
import useModal from '#commonHooks/useModal';
import { SnsLeakedDataModal } from '@/app/views/pages/panel/layouts/sns/components/SnsLeakedDataModal';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import SnsCardTitle from './SnsCardTitle';
import Show from '@/app/views/components/Show/Show';

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
  const [leaked, setLeaked] = useState<any>(null);
  const [leakedType, setLeakedType] = useState<'crack' | 'geo'>('crack');
  const { showModal, setShowModal } = useModal();
  useEffect(() => {
    if (!getUserdata()) return;
    if (searchData) {
      setSearchData(searchData);
      procSearch();
    }
    if (searchClass && searchData) procSearch(undefined!);
  }, []);

  const procSearch = (e?: FormEvent): any => {
    if (e) e.preventDefault();

    handleSearch()?.then(() => {
      refetch();
    });
  };
  const selectBarOptions = {
    options: {
      _domain: 'domain',
      email: 'email',
      username: 'username',
      password: 'password',
      name: 'full name',
      hash: 'hash',
      lastip: 'lastip',
    },
    placeHolder: '',
    value: searchClass,
    change: (e: any) => setSearchClass(e.target.value),
    defaultSelectOption: 'email',
  };

  const closeCrackModal = () => {
    setLeaked(null);
    setShowModal(false);
  };

  const openLeakedModal = (leaked: any, type: 'crack' | 'geo') => {
    setLeaked(leaked);
    setLeakedType(type);
    setShowModal(true);
  };

  return (
    <>
      <div className="search-bar-container">
        <SearchBar
          handleChange={(e: ChangeEvent<HTMLInputElement>) => setSearchData(e.target.value)}
          placeHolder="Search"
          inputValue={searchData}
          handleSubmit={procSearch}
          searchIcon="Search leaks"
          isActiveSelect
          selectOptions={selectBarOptions}
        />
      </div>

      <Show when={!isLoading} fallback={<PageLoader />}>
        <div className="content" style={{ marginBottom: '1.2rem', height: '100%' }}>
          {intelData.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
              }}>
              <div>
                <SnsCardTitle />
              </div>
            </div>
          ) : (
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {intelData.map((intel, index) => (
                <div key={index} className="search-result">
                  <div className="header">
                    <div className="title">
                      {intel?.name
                        ? intel.name
                            .replace(/_\d+[MK]$/, '')
                            .charAt(0)
                            .toUpperCase() +
                          intel.name
                            .replace(/_\d+[MK]$/, '')
                            .slice(1)
                            .toLowerCase()
                        : ''}
                    </div>
                  </div>
                  <div className="info">
                    {intel?.value.map((subIntel: any, subIndex: number) => (
                      <div
                        key={subIndex}
                        className="text containersubintel"
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        }}>
                        {Object.keys(subIntel).map((subIntelVal, subIntelValIndex) => (
                          <div key={subIntelValIndex} className="intel-row">
                            <span
                              className="intel-label"
                              style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                              {subIntelVal.charAt(0).toUpperCase() +
                                subIntelVal.slice(1).toLowerCase()}
                              :{' '}
                            </span>
                            <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                              {subIntel[subIntelVal]}
                            </span>
                          </div>
                        ))}
                        {subIntel.hash && (
                          <div>
                            <button
                              onClick={() => {
                                openLeakedModal(intel, 'crack');
                              }}
                              className="crack-btn">
                              click to crack
                            </button>
                          </div>
                        )}
                        {subIntel.regip && (
                          <div>
                            <button
                              onClick={() => {
                                openLeakedModal(intel, 'geo');
                              }}
                              className="codefend-text-red no-outline bolder no-border">
                              click to geolocate
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </Show>
      <SnsLeakedDataModal
        type={leakedType}
        isActive={showModal}
        close={closeCrackModal}
        leaked={leaked}
        searchClass={searchClass}
      />
    </>
  );
};

export default SnsSearchAndData;
