import React, { Fragment, useEffect } from 'react';
import {
	generateIDArray,
	useAuthState,
	useHighlightLinesWithUrl,
	useIntelPreview,
	useIntelSearch,
	useInitialSearch,
	useInxReadFile,
} from '../../../../../../data';
import {
	CloseIcon,
	PageLoader,
	PageLoaderOverlay,
	SearchBar,
	SearchIcon,
	Show,
} from '../../../../../components';
import { InxPreviewIntelData } from './InxPreviewIntelData';

interface InxSearchAndDataProps {
	refetch: () => void;
}

export const InxSearchAndData: React.FC<InxSearchAndDataProps> = (props) => {
	const { highlightWithUrl } = useHighlightLinesWithUrl();
	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID as string;

	const { getData, setSearchData, refetchInitial } = useInitialSearch();
	const { intelData, refetchIntelData, setIntelData } = useIntelSearch();
	const { intelPreview, refetchPreview } = useIntelPreview();
	const { fullDataLoading, selectedResult, setSelectedResult, readFile } =
		useInxReadFile();

	useEffect(() => {
		procSearch();
	}, []);

	const delay = (ms: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	const procSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		refetchInitial(companyID)?.then((res: any) => {
			return procIntelSearch(res);
		});
	};

	const procIntelSearch = (res?: string) => {
		return refetchIntelData(
			res ? res : getData().intelID,
			getData().offSet,
			companyID,
		).then((res: any) => {
			props.refetch();
			setSearchData((state: any) => ({
				...state,
				offSet: getData().offSet,
			}));
			//processAllIntelData(intelResult);
		});
	};

	const processAllIntelData = async (inputData: any) => {
		for (const intel of inputData) {
			const params = {
				sid: intel.storage_id,
				bid: intel.bucket_id,
				mid: intel.media_id,
			};
			processPreview(intel);
		}
		await delay(4000);
	};

	const processPreview = (params: any) => {
		return refetchPreview(params, companyID)?.then(() => {
			const initial = intelData;
			setIntelData([]);
			setIntelData(initial);
		});
	};

	const procMoreResults = () => {
		if (!getData().isLoading) return procIntelSearch();
		return [];
	};

	const procReadFile = (intel: any) => {
		readFile(intel, companyID);
	};

	const intelKeys = () =>
		intelData.length !== 0 ? generateIDArray(intelData.length) : [];

	return (
		<div className="border h-5/6">
			<Show when={selectedResult !== null}>
				<>
					<div className="fixed left-0 top-0 h-full w-full bg-gray-500 bg-opacity-25 overflow-y-hidden overflow-x-hidden outline-none">
						<div className="pointer-events-none relative w-auto translate-y-[50px] transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px] min-[992px]:max-w-[800px] min-[1200px]:max-w-[1140px]">
							<div className="pointer-events-auto relative flex w-full flex-col border-none bg-white bg-clip-padding text-black dark:text-current shadow-lg outline-none dark:bg-neutral-600 ">
								<div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
									<h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
										{selectedResult?.fileName},{' '}
										{selectedResult?.fileType}
									</h5>
									<button
										onClick={() => setSelectedResult(null)}
										type="button"
										className="btn btn no-border-height w-14 items-center justify-center">
										<CloseIcon />
									</button>
								</div>

								<div className="relative p-4 max-h-[48rem] h-full overflow-y-scroll">
									<h3 className="text-xl font-bold leading-normal text-neutral-800 dark:text-neutral-200">
										Main results
									</h3>

									<div
										className="max-w-md text-xs break-words"
										dangerouslySetInnerHTML={{
											__html: highlightWithUrl(
												selectedResult?.intelSelected,
												getData().search,
											),
										}}></div>

									<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

									<h3 className="text-xl font-bold leading-normal text-neutral-800 dark:text-neutral-200">
										Full list
									</h3>
									<div
										className="max-w-md text-xs break-words"
										dangerouslySetInnerHTML={{
											__html: selectedResult?.intelSelected.replace(
												/(\r\n|\n|\r)/g,
												'<br>',
											),
										}}></div>
								</div>
							</div>
						</div>
					</div>
				</>
			</Show>
			<div className="search-bar-container">
				<SearchBar
					inputValue={getData().search}
					placeHolder="Search"
					handleChange={(e: any) =>
						setSearchData((state) => ({
							...state,
							search: e.target.value,
						}))
					}
					handleSubmit={procSearch}
					searchIcon={<SearchIcon isButton />}
				/>
			</div>

			<Show when={!getData().isLoading} fallback={<PageLoader />}>
				<div className="flex internal-tables flex-col overflow-auto max-h-full overflow-x-hidden border-r-0 max-w-[80dvh]">
					{intelData.map((intel: any, i: number) => (
						<Fragment key={intelKeys()[i]}>
							<InxPreviewIntelData
								intelKey={intelKeys()[i]}
								intel={intel}
								readFile={procReadFile}
								intelPreview={intelPreview}
							/>
						</Fragment>
					))}
				</div>
			</Show>
			<Show when={fullDataLoading}>
				<PageLoaderOverlay />
			</Show>
		</div>
	);
};
