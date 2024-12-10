import { type FC, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { SearchBar } from '@standalones/SearchBar';
import { ScanSearchIcon } from '@icons';
import Masonry from 'react-masonry-css';
import { useSns } from '@moduleHooks/sns/useSns.ts';
import Show from '@defaults/Show.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';

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
    refetch();
    handleSearch();
  };
  const selectBarOptions = {
    options: { email: 'email', password: 'password', name: 'full name' },
    placeHolder: '',
    value: searchClass,
    change: (e: any) => setSearchClass(e.target.value),
    defaultSelectOption: 'email',
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
                  <div className="title">{intel?.name}</div>
                </div>
                <div className="info">
                  {intel?.value.map((subIntel: any, subIndex: number) => (
                    <div
                      key={subIndex}
                      className="text"
                      style={{
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '260px',
                        overflow: 'hidden',
                      }}>
                      {Object.keys(subIntel).map((subIntelVal, subIntelValIndex) => (
                        <div key={subIntelValIndex}>
                          {`${subIntelVal}: ${subIntel[subIntelVal]}`}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </Show>
    </>
  );
};

export default SnsSearchAndData;
