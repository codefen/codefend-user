import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
	generateIDArray,
	useAuthState,
	useHighlightLinesWithUrl,
	useIntelSearch,
	useInitialSearch,
	useInxReadFile,
	cleanHTML,
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

	const mainResultCleanHTML = cleanHTML(
		highlightWithUrl(selectedResult?.intelSelected, getData().search),
	);

	const fullListCleanHTML = cleanHTML(
		selectedResult?.intelSelected.replace(/(\r\n|\n|\r)/g, '<br>'),
	);

	const intelLenght = intelData.length;

	console.log({ selectedResult });
	return (
		<div className="left-wrapper">
			<ModalTitleWrapper
				close={closePreviewModal}
				headerTitle="Full preview data"
				isActive={selectedResult !== null && viewPreviewModal}>
				<>
					<div className="full-preview-container">
						<div className="full-preview-header">
							<h2 className="full-preview-title">
								{selectedResult?.fileName}, {selectedResult?.fileType}
							</h2>
						</div>

						<div className="full-preview-content">
							<h3 className="preview-content-title">Main results</h3>

							<div
								className="preview-content"
								dangerouslySetInnerHTML={{
									__html: mainResultCleanHTML,
								}}></div>

							<hr className="preview-dash "></hr>

							<h3 className="preview-content-title">Full list</h3>
							<div
								className="preview-content"
								dangerouslySetInnerHTML={{
									__html: fullListCleanHTML,
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
						<Show when={Boolean(intelLenght)} fallback={<EmptyCard />}>
							<>
								{intelData.map((intel: any, i: number) => (
									<Fragment key={intelKeys[i]}>
										<InxPreviewIntelData
											intel={intel}
											readFile={procReadFile}
											companyID={companyID}
											intelLenght={intelLenght}
											index={i}
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
