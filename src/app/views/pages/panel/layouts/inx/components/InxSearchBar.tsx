import { useState } from 'react';
import { SearchBar, SearchIcon } from '../../../../../components';

interface Props {
	initSearch: string;
	searchFn: (term: string) => void;
}

export const InxSearchBar: React.FC<Props> = ({ searchFn, initSearch }) => {
	const [searchState, setSearch] = useState(initSearch ?? '');

	const handleSubmit = () => {
		searchFn(searchState);
	};

	return (
		<div className="search-bar-container">
			<SearchBar
				inputValue={searchState}
				placeHolder="Search"
				handleChange={(e: any) => setSearch((state) => e.target.value)}
				handleSubmit={handleSubmit}
				searchIcon={<SearchIcon isButton />}
			/>
		</div>
	);
};
