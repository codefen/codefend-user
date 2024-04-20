import { type FC, Fragment, useState } from 'react';
import {
	useHighlightLinesWithUrl,
	useIntelSearch,
	useInitialSearch,
	useInxReadFile,
} from '../../../../../../data';
import {
	EmptyCard,
	ModalTitleWrapper,
	PageLoader,
	PageLoaderOverlay,
	Show,
} from '../../../../../components';
import { InxPreviewIntelData } from './InxPreviewIntelData';
import { InxSearchBar } from './InxSearchBar';
import { useUserData } from '#commonUserHooks/useUserData';

interface InxSearchAndDataProps {
	refetch: () => void;
}

export const InxSearchAndData: FC<InxSearchAndDataProps> = (props) => {
	const { highlightWithUrl } = useHighlightLinesWithUrl();
	const { getCompany } = useUserData();
	const companyID = getCompany();
	const [viewPreviewModal, setViewPreviewModal] = useState(true);

	const { getData, setSearchData, refetchInitial, isLoading } =
		useInitialSearch();

	const { intelData, refetchIntelData, setIntelData } = useIntelSearch();

	const { fullDataLoading, selectedResult, fileName, fileType, readFile } =
		useInxReadFile();

	const procSearch = (term: string) => {
		setIntelData([]);
		setSearchData({
			intelID: '',
			count: 0,
			offSet: 0,
			search: term,
		});
		if (!term.trim()) return;

		refetchInitial(companyID, term)?.then((res: any) => {
			if (res.error == 1) return;

			return procIntelSearch(res.id, false);
		});
	};

	const procIntelSearch = (id?: string, more?: boolean) => {
		const offSet = more ? getData().offSet : 0;
		return refetchIntelData(
			id ? id : getData().intelID,
			offSet,
			companyID,
		).then((res: any) => {
			if (!more) {
				props.refetch();
			}
			setSearchData((state: any) => ({
				...state,
				offSet: offSet + res.intelLen,
				count: offSet + res.intelLen,
			}));
		});
	};

	const procReadFile = (intel: any) => {
		if (
			!selectedResult.current ||
			(selectedResult.current && fileName.current !== intel.name)
		) {
			readFile(intel, companyID);
		}
		setViewPreviewModal(true);
	};

	const closePreviewModal = () => setViewPreviewModal(false);

	return (
		<div className="left-wrapper">
			<ModalTitleWrapper
				close={closePreviewModal}
				headerTitle="Full preview data"
				isActive={selectedResult.current !== null && viewPreviewModal}>
				<div className="full-preview-container">
					<div className="full-preview-header">
						<h2 className="full-preview-title">
							{fileName.current || ''}, {fileType.current || ''}
						</h2>
					</div>

					<div className="full-preview-content">
						<h3 className="preview-content-title">Main results</h3>

						<div
							className="preview-content"
							dangerouslySetInnerHTML={{
								__html: highlightWithUrl(
									selectedResult.current || '',
									getData().search,
								),
							}}></div>

						<hr className="preview-dash "></hr>

						<h3 className="preview-content-title">Full list</h3>
						<div
							className="preview-content"
							dangerouslySetInnerHTML={{
								__html: selectedResult.current
									? selectedResult.current.replace(
											/(\r\n|\n|\r)/g,
											'<br>',
										)
									: '',
							}}></div>
					</div>
				</div>
			</ModalTitleWrapper>

			<InxSearchBar searchFn={procSearch} initSearch={''} />

			<Show when={!isLoading} fallback={<PageLoader />}>
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
									<Fragment key={`intel-${i}`}>
										<InxPreviewIntelData
											intel={intel}
											readFile={procReadFile}
											moreResults={procIntelSearch}
											companyID={companyID}
											index={i}
											maxPage={getData().count}
											page={getData().offSet}
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
