import { type FC, useState } from 'react';
import { InxPreviewIntelData } from './InxPreviewIntelData';
import { InxSearchBar } from './InxSearchBar';
import { useUserData } from '#commonUserHooks/useUserData';
import InxFullPreviewModal from '@modals/InxFullPreview/InxFullPreviewModal';
import { useInitialSearch, useIntelSearch, useInxReadFile } from '@moduleHooks/inx';
import Show from '@/app/views/components/Show/Show';
import { PageLoader, PageLoaderOverlay } from '@/app/views/components/loaders/Loader';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';

interface InxSearchAndDataProps {
  refetch: () => void;
}

export const InxSearchAndData: FC<InxSearchAndDataProps> = props => {
  const { getCompany } = useUserData();
  const companyID = getCompany();
  const [viewPreviewModal, setViewPreviewModal] = useState(true);

  const { getData, setSearchData, refetchInitial, isLoading } = useInitialSearch();

  const { intelData, refetchIntelData, setIntelData } = useIntelSearch();

  const { fullDataLoading, selectedResult, fileName, fileType, readFile } = useInxReadFile();

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
    return refetchIntelData(id ? id : getData().intelID, offSet, companyID).then((res: any) => {
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
    if (!selectedResult.current || (selectedResult.current && fileName.current !== intel.name)) {
      readFile(intel, companyID);
    }
    setViewPreviewModal(true);
  };

  const closePreviewModal = () => setViewPreviewModal(false);
  const hasEntries = Boolean(intelData.length);
  return (
    <div className="left-wrapper">
      <InxFullPreviewModal
        close={closePreviewModal}
        open={viewPreviewModal}
        results={selectedResult.current}
        fileName={fileName.current}
        fileType={fileType.current}
        search={getData().search}
      />

      <InxSearchBar searchFn={procSearch} initSearch={''} />

      <Show when={!isLoading} fallback={<PageLoader />}>
        <>
          {hasEntries && (
            <div className="intel-result-data">
              <span className="result-text">Search Results:</span> {getData().count}
            </div>
          )}
          <div className="intel-results-container">
            <Show when={hasEntries} fallback={<EmptyCard />}>
              <>
                {intelData.map((intel: any, i: number) => (
                  <InxPreviewIntelData
                    key={`intel-${i}`}
                    intel={intel}
                    readFile={procReadFile}
                    moreResults={procIntelSearch}
                    companyID={companyID}
                    index={i}
                    maxPage={getData().count}
                    page={getData().offSet}
                  />
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
