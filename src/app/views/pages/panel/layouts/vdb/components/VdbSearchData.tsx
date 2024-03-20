import React, { useMemo, useState } from 'react';
import {
	ResultsVdbSearch,
	ResultsVdbSearchV2,
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
	const { vdbResults, refetch, isLoading, searchData, handleChange } =
		useInitialVdb();

	const dataTable = vdbResults.current.map((data: ResultsVdbSearchV2) => ({
		ID: { value: data.id, style: '' },
		Identifier: { value: data.id, style: 'id' },
		published: { value: data.createdAt, style: 'date' },
		cve: { value: data.entryID, style: 'cve' },
		title: { value: data.title, style: 'vul-title' },
		score: {
			value: <RiskScore riskScore={data.riskScore || '0'} />,
			style: 'vul-score',
		},
		risk: { value: data.riskName, style: 'vul-risk' },
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
				<div className="vdb-app-info">
					<TableV2
						rowsData={dataTable}
						columns={vdbColumns}
						showRows={!isLoading}
						showEmpty={!Boolean(vdbResults.current.length)}
						sizeY={75}
					/>
				</div>
			</Show>
		</>
	);
};
