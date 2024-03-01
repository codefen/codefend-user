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

	const dataTable = getVdb().map((data: ResultsVdbSearch) => ({
		ID: { value: data.entry.id, style: '' },
		Identifier: { value: data.entry.id, style: 'id' },
		published: { value: data.advisory.date, style: 'date' },
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
			<Show when={!isLoading} fallback={<PageLoader />}>
				<>
					<div className="vdb-app-info">
						<TableV2
							rowsData={dataTable}
							columns={vdbColumns}
							showRows={!isLoading}
							showEmpty={!Boolean(getVdb().length)}
							sizeY={75}
						/>
					</div>
				</>
			</Show>
		</>
	);
};
