import { type FC, useEffect, type ChangeEvent, type FormEvent, useState } from 'react';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import { ScanSearchIcon } from '@icons';
import Masonry from 'react-masonry-css';
import { useSns } from '@moduleHooks/sns/useSns.ts';
import useModal from '#commonHooks/useModal';
import { SnsLeakedDataModal } from '@/app/views/pages/panel/layouts/sns/components/SnsLeakedDataModal';
import { PageLoader } from '@/app/views/components/loaders/Loader';
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
          searchIcon={<ScanSearchIcon isButton />}
          isActiveSelect
          selectOptions={selectBarOptions}
        />
      </div>

      <Show when={!isLoading} fallback={<PageLoader />}>
        <div className="content">
          <Masonry
            breakpointCols={3}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {intelData.map((intel, index) => (
              <div key={index} className="search-result">
                <div className="header">
                  <div className="title">{intel?.name.replace(/_\d+[MK]$/, '')}</div>
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
                        <div key={subIntelValIndex}>
                          {`${subIntelVal}: ${subIntel[subIntelVal]}`}
                        </div>
                      ))}
                      {subIntel.hash && (
                        <div>
                          <button
                            onClick={() => {
                              openLeakedModal(intel, 'crack');
                            }}
                            className="codefend-text-red no-outline bolder no-border">
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
