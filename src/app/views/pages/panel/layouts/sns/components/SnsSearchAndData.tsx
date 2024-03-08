import {
	PageLoader,
	ScanSearchIcon,
	SearchBar,
	Show,
} from '../../../../../../views/components';
import Masonry from 'react-masonry-css';
import { SnsService, User, useAuthState } from '../../../../../../data';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useLocation } from 'react-router';

interface PersonInfo {
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	gender?: string;
	lastip?: string;
	username?: string;
	country?: string;
	created?: string;
	followers?: string;
	hash?: string;
	id?: string;
	birthdate?: string;
	regdate?: string;
	uid?: string;
	[key: string]: any;
}

const SnsSearchAndData: React.FC = () => {
	const query = new URLSearchParams(useLocation().search);
	const [searchData, setSearchData] = useState(query.get('search') ?? '');
	const [searchClass, setSearchClass] = useState<string>(
		query.get('class') ?? '',
	);
	const [intelData, setIntelData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const { getUserdata, getCompany } = useAuthState();
	const companyID = getCompany();

	const user = getUserdata as unknown as User;

	useEffect(() => {
		if (!getUserdata()) return;
		if (searchData) {
			setSearchData(searchData);
			procSearch();
		}
	}, []);

	useEffect(() => {
		if (searchClass && searchData) procSearch(undefined!);
	}, []);

	const procSearch = (e?: React.FormEvent): any => {
		if (e) {
			e.preventDefault();
		}
		setLoading(true);
		setIntelData([]);
		SnsService.initialSnsData(
			{
				keyword: searchData,
				class: searchClass,
			},
			companyID,
		)
			.then((res: any) => {
				const arrayOfObjects = Object.entries(res.response.results).map(
					([key, value]) => {
						const name = key.split('_').slice(1, -2).join('_');
						return { name, value: value as PersonInfo[] };
					},
				);
				setIntelData(arrayOfObjects);
			})
			.catch((err: any) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const selectBarOptions = {
		options: { email: 'email', password: 'password', name: 'full name' },
		placeHolder: 'email',
		value: searchClass,
		change: (e: any) => setSearchClass(e.target.value),
	};

	return (
		<>
			<div className="search-bar-container">
				<SearchBar
					handleChange={(e: ChangeEvent<HTMLInputElement>) =>
						setSearchData(e.target.value)
					}
					placeHolder="Search"
					inputValue={searchData}
					handleSubmit={procSearch}
					searchIcon={<ScanSearchIcon isButton />}
					isActiveSelect
					selectOptions={selectBarOptions}
				/>
			</div>

			<Show when={!loading} fallback={<PageLoader />}>
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
									{intel?.value.map(
										(subIntel: PersonInfo, subIndex: number) => (
											<div
												key={subIndex}
												className="text"
												style={{
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													maxWidth: '260px',
													overflow: 'hidden',
												}}>
												{Object.keys(subIntel).map(
													(subIntelVal, subIntelValIndex) => (
														<div key={subIntelValIndex}>
															{`${subIntelVal}: ${subIntel[subIntelVal]}`}
														</div>
													),
												)}
											</div>
										),
									)}
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
