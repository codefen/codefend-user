import { type FC, type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar, SearchIcon } from '../../../../../components';
import { toast } from 'react-toastify';

const DashboardSearchbar: FC = () => {
	const navigate = useNavigate();
	const [searchValue, setSearchValue] = useState('');
	const [searchClass, setSearchClass] = useState('email');
	const getSearchClass = () => searchClass;

	const selectBarOptions = {
		options: { email: 'email', password: 'password', name: 'full name' },
		placeHolder: '',
		defaultSelectOption: 'email',
		value: getSearchClass(),
		change: (e: ChangeEvent<HTMLSelectElement>) =>
			setSearchClass(e.target.value),
	};

	const handleSubmit = () => {
		if (!searchValue.trim()) return;
		if (!searchClass) {
			toast.warn('You must select a class to search');
			return;
		}
		navigate('/sns?search=' + searchValue + '&class=' + searchClass);
	};

	return (
		<SearchBar
			placeHolder="search data leak"
			isActiveSelect
			selectOptions={selectBarOptions}
			handleSubmit={handleSubmit}
			handleChange={(e: any) => setSearchValue(e.target.value)}
			inputValue={searchValue}
			searchIcon={<SearchIcon isButton />}
		/>
	);
};

export default DashboardSearchbar;
