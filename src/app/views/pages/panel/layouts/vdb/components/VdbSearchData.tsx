import React, { useMemo, useState } from 'react';
import {
	ResultsVdbSearch,
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
	TableV2,
	RiskScore,
} from '../../../../../components';

export const VdbSearchData: React.FC = () => {
	const { getVdb, refetch, isLoading, searchData, handleChange } =
		useInitialVdb();

	const [sortBy, setSortBy] = useState('');

	const [selectedNow, setSelectedNow] = useState(false);

	const vdbKeys = useMemo(() => generateIDArray(getVdb().length), [getVdb()]);

	const dataTable = getVdb().map((data: ResultsVdbSearch) => ({
		ID: { value: data.entry.id, style: '' },
		Identifier: { value: data.entry.id, style: 'id' },
		cve: { value: data.source.cve.id, style: 'cve' },
		title: { value: data.entry.title, style: 'vul-title' },
		score: {
			value: <RiskScore riskScore={data.vulnerability.risk.value} />,
			style: 'vul-score',
		},
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
			<div className="left-main">
				<Show when={!isLoading} fallback={<PageLoader />}>
					<Show when={Boolean(getVdb().length)}>
						<>
							<div className="vdb-app-info">
								<TableV2
									rowsData={dataTable}
									columns={vdbColumns}
									showRows={!isLoading}
									showEmpty={getVdb().length === 0}
									sizeY={50}
								/>
							</div>
						</>
					</Show>
				</Show>
				<Show when={!isLoading && Boolean(getVdb().length)}>
					<>
						<div className="header">
							<div className="title">
								<div className="icon">
									<BugIcon />
								</div>
								<span>Search vulnerabilities</span>
							</div>
							<select
								onChange={(e) => {
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
						</div>
						<div className="content">
							{getVdb().map((vuln: ResultsVdbSearch, i: number) => (
								<div className="search-result" key={vdbKeys[i]}>
									<div className="header-result">
										<h5 className="title">{vuln.entry.title}</h5>
									</div>
								</div>
							))}
						</div>
					</>
				</Show>
			</div>
		</>
	);
};
