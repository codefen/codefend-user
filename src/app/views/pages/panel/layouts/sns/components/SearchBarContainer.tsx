import { type FC, type ChangeEvent, type FormEvent } from 'react';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';
import type { SearchOptions } from '../../../../../../data/interfaces/snsTypes';

interface SearchBarContainerProps {
  searchData: string;
  setSearchData: (value: string) => void;
  handleSubmit: (e?: FormEvent) => void;
  selectBarOptions: {
    options: SearchOptions;
    placeHolder: string;
    value: string;
    change: (e: ChangeEvent<HTMLSelectElement>) => void;
    defaultSelectOption: string;
  };
}

export const SearchBarContainer: FC<SearchBarContainerProps> = ({
  searchData,
  setSearchData,
  handleSubmit,
  selectBarOptions,
}) => {
  return (
    <div className="search-bar-container">
      <SearchBar
        handleChange={(e: ChangeEvent<HTMLInputElement>) => setSearchData(e.target.value)}
        placeHolder="Search"
        inputValue={searchData}
        handleSubmit={handleSubmit}
        searchIcon="Search leaks"
        isActiveSelect
        selectOptions={selectBarOptions}
      />
    </div>
  );
};
