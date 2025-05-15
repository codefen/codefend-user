import { type FC, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';

interface SearchBarContainerProps {
  placeholder?: string;
  icon?: ReactNode;
  searchText?: string;
  searchData: string;
  setSearchData: (value: string) => void;
  handleSubmit: (e?: FormEvent) => void;
  selectBarOptions: {
    options: any;
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
  placeholder = 'Search',
  icon = null,
  searchText = 'Search leaks',
}) => {
  return (
    <div className="search-bar-container">
      <SearchBar
        handleChange={(e: ChangeEvent<HTMLInputElement>) => setSearchData(e.target.value)}
        placeHolder={placeholder}
        inputValue={searchData}
        handleSubmit={handleSubmit}
        searchText={searchText}
        searchIcon={icon}
        isActiveSelect
        selectOptions={selectBarOptions}
      />
    </div>
  );
};
