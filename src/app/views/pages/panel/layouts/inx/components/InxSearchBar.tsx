import { type FC, useState } from 'react';
import { SearchIcon } from '@icons';
import { SearchBar } from '@/app/views/components/SearchBar/SearchBar';

interface InxSearchBarProps {
  initSearch: string;
  searchFn: (term: string) => void;
}

export const InxSearchBar: FC<InxSearchBarProps> = ({ searchFn, initSearch }) => {
  const [searchState, setSearch] = useState(initSearch ?? '');

  const handleSubmit = () => {
    searchFn(searchState);
  };

  return (
    <div className="search-bar-container">
      <SearchBar
        inputValue={searchState}
        placeHolder="Search"
        handleChange={(e: any) => setSearch(state => e.target.value)}
        handleSubmit={handleSubmit}
        searchIcon={<SearchIcon isButton />}
      />
    </div>
  );
};
