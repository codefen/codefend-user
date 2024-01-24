import React, { useEffect, useMemo, useState } from 'react';
import {
	ResultsVdbSearch,
	VdbProps,
	generateIDArray,
	useInitialVdb,
	vdbColumns,
} from '../../../../../../data';
import {
	BugIcon,
	ScanSearchIcon,
	PageLoader,
	SearchBar,
	Show,
	Table,
	TableV2,
} from '../../../../../components';

export const VdbSearchData: React.FC = () => {
	const { getVdb, refetch, isLoading, searchData, handleChange } =
		useInitialVdb();

	const [sortBy, setSortBy] = useState('');

	const [selectedNow, setSelectedNow] = useState(false);

	const safelyVdbData = (): ResultsVdbSearch[] =>
		Array.isArray(getVdb().results) ? getVdb().results ?? [] : [];

	const vdbKeys = useMemo(
		() => generateIDArray(safelyVdbData().length),
		[safelyVdbData()],
	);

	const dataTable = safelyVdbData().map((data: ResultsVdbSearch) => ({
		publisshed: { value: data.advisory.date, style: 'date' },
		ID: { value: data.entry.id, style: 'id' },
		cve: { value: data.source.cve.id, style: 'cve' },
		title: { value: data.entry.title, style: 'title' },
		score: { value: data.vulnerability.risk.value, style: 'vul-score' },
		risk: { value: data.vulnerability.risk.name, style: 'vul-risk' },
	}));
	return (
		<>
			<div className="search-bar-container">
				<SearchBar
					inputValue={searchData}
					placeHolder="Enter a program name (e.g. Mozilla Firefox)"
					handleChange={handleChange}
					handleSubmit={refetch}
					searchIcon={<ScanSearchIcon isButton />}
				/>
			</div>
			<Show when={Boolean(safelyVdbData().length)}>
				<Show when={!isLoading} fallback={<PageLoader />}>
					<>
						<div className="mx-3">
							<TableV2
								rowsData={dataTable}
								columns={vdbColumns}
								showRows={!isLoading}
								showEmpty={Boolean(safelyVdbData().length)}
								sizeY={50}
							/>
							<div className="header">
								<div className="title">
									<div className="icon">
										<BugIcon />
									</div>
									<span>Search vulnerabilities</span>
								</div>
								<select
									onChange={(e) => {
										console.log({ e });
										setSortBy(e.target.value);
										setSelectedNow(true);
									}}
									className="hidden md:inline bg-transparent ml-10">
									<option value="" disabled>
										Sort by
									</option>
									<option value="creacion">published</option>
									<option value="score">score</option>
									<option value="risk">risk</option>
									<option value="vdb id">vdb id</option>
								</select>
								<div className="actions"></div>
							</div>
						</div>
					</>
				</Show>
			</Show>
			<Show when={!isLoading} fallback={<PageLoader />}>
				<div className="content">
					{safelyVdbData().map((vuln: ResultsVdbSearch, i: number) => (
						<div className="search-result" key={vdbKeys[i]}>
							<div className="header">
								<div className="title">{vuln.entry.title}</div>
							</div>
						</div>
					))}
				</div>
			</Show>
		</>
	);
};
