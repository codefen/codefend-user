import { type FC, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';

interface SearchBarContainerProps {
  placeholder?: string;
  icon?: ReactNode;
  searchText?: string;
  searchData: string;
  setSearchData: (value: string) => void;
  handleSubmit: (e?: FormEvent) => void;
  isDisabled?: boolean;
  selectBarOptions?: {
    options: any;
    placeHolder: string;
    value: string;
    change: (e: ChangeEvent<HTMLSelectElement>) => void;
    defaultSelectOption: string;
  };
  inputAnimationStep?: number;
}

export const SearchBarContainer: FC<SearchBarContainerProps> = ({
  searchData,
  setSearchData,
  handleSubmit,
  selectBarOptions,
  placeholder = 'Search',
  icon = null,
  searchText = 'Search leaks',
  isDisabled = false,
  inputAnimationStep = 0,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // console.log('🎯 SearchBarContainer handleChange:', {
    //   originalValue: value,
    //   length: value.length,
    //   hasSpaces: value.includes(' '),
    //   charCodes: value.split('').map(c => c.charCodeAt(0))
    // });
    setSearchData(value);
  };

  return (
    <div className="search-bar-container">
      <SearchBar
        handleChange={handleInputChange}
        placeHolder={placeholder}
        inputValue={searchData}
        handleSubmit={handleSubmit}
        searchText={searchText}
        searchIcon={icon}
        isActiveSelect={!!selectBarOptions}
        selectOptions={selectBarOptions}
        isDisabled={isDisabled}
        inputAnimationStep={inputAnimationStep}
      />
    </div>
  );
};
