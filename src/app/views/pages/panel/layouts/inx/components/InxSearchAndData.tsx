import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
	generateIDArray,
	useAuthState,
	useHighlightLinesWithUrl,
	useIntelSearch,
	useInitialSearch,
	useInxReadFile,
} from '../../../../../../data';
import {
	CloseIcon,
	EmptyCard,
	ModalTitleWrapper,
	PageLoader,
	PageLoaderOverlay,
	Show,
} from '../../../../../components';
import { InxPreviewIntelData } from './InxPreviewIntelData';
import { InxSearchBar } from './InxSearchBar';
import { useParams } from 'react-router-dom';

interface InxSearchAndDataProps {
	refetch: () => void;
}

export const InxSearchAndData: React.FC<InxSearchAndDataProps> = (props) => {
	const { highlightWithUrl } = useHighlightLinesWithUrl();
	const { getUserdata } = useAuthState();
	const { search } = useParams();
	const companyID = getUserdata().companyID;

	const { getData, setSearchData, refetchInitial } = useInitialSearch();

	const { intelData, refetchIntelData, setIntelData } = useIntelSearch();

	const { fullDataLoading, selectedResult, setSelectedResult, readFile } =
		useInxReadFile();

	const [viewPreviewModal, setViewPreviewModal] = useState(true);

	useEffect(() => {
		//It is executed when there is a "term" by default in the path
		if (search && search.trim() !== '') {
			procSearch(search);
		}
	}, []);

	const procSearch = (term: string) => {
		if (!term.trim()) {
			return;
		}
		setSearchData((prev) => ({ ...prev, isLoading: true }));
		refetchInitial(companyID, term)?.then((res: any) => {
			if (res.error == 1) return;

			return procIntelSearch(res);
		});
	};

	const procIntelSearch = (id?: string) => {
		return refetchIntelData(
			id ? id : getData().intelID,
			getData().offSet,
			companyID,
		).then((res: any) => {
			props.refetch();
			setSearchData((state: any) => ({
				...state,
				offSet: getData().offSet + res.intelLen,
			}));
		});
	};

	const procReadFile = (intel: any) => {
		if (
			!selectedResult ||
			(selectedResult && selectedResult?.fileName !== intel.name)
		) {
			readFile(intel, companyID);
		}
		setViewPreviewModal(true);
	};

	const intelKeys = useMemo(
		() => (intelData.length !== 0 ? generateIDArray(intelData.length) : []),
		[intelData],
	);

	const closePreviewModal = () => setViewPreviewModal(false);

	console.log({ selectedResult });
	return (
		<div className="left-wrapper">
			<ModalTitleWrapper
				close={closePreviewModal}
				headerTitle="Full preview data"
				isActive={selectedResult !== null && viewPreviewModal}>
				<>
					<div className="pointer-events-auto relative flex w-full flex-col border-none bg-white bg-clip-padding text-black dark:text-current shadow-lg outline-none dark:bg-neutral-600 ">
						<div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
							<h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
								{selectedResult?.fileName}, {selectedResult?.fileType}
							</h5>
							<button
								onClick={closePreviewModal}
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
				</>
			</ModalTitleWrapper>

			<InxSearchBar searchFn={procSearch} initSearch={search!} />

			<Show when={!getData().isLoading} fallback={<PageLoader />}>
				<>
					{Boolean(intelData.length) && (
						<div className="intel-result-data">
							<span className="result-text">Search Results:</span>{' '}
							{getData().count}
						</div>
					)}
					<div className="intel-results-container">
						<Show
							when={Boolean(intelData.length)}
							fallback={<EmptyCard />}>
							<>
								{intelData.map((intel: any, i: number) => (
									<Fragment key={intelKeys[i]}>
										<InxPreviewIntelData
											intel={intel}
											readFile={procReadFile}
											companyID={companyID}
										/>
									</Fragment>
								))}
							</>
						</Show>
					</div>
				</>
			</Show>
			<Show when={fullDataLoading}>
				<PageLoaderOverlay />
			</Show>
		</div>
	);
};
