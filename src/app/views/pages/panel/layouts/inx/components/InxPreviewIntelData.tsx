import { type FC, useState, useEffect } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { formatDateTimeFormat, useIntelPreview } from '../../../../../../data';
import { InxPreviousContentData } from './InxPreviousContentData';

interface InxPreviewIntelDataProps {
  intel: any;
  readFile: (intel: any) => void;
  moreResults: (id?: string, more?: boolean) => Promise<void>;
  companyID: string;
  index: number;
  page: number;
  maxPage: number;
}

export const InxPreviewIntelData: FC<InxPreviewIntelDataProps> = ({
  intel,
  readFile,
  companyID,
  index,
  page,
  moreResults,
  maxPage,
}) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });
  const { intelPreview, isLoadingPreview, refetchPreview, cancelRequest } = useIntelPreview();
  const [previewReq, setPreviewReq] = useState<boolean>(false);

  useEffect(() => {
    //Try to run every time the html appears or exits the screen
    if (isIntersecting && !previewReq) {
      const params = {
        sid: intel.storageid,
        bid: intel.bucket,
        mid: intel.type,
      };

      refetchPreview(params, companyID);

      if (page < maxPage && index === page - 3) {
        moreResults('', true);
      }

      //Traffic light so that it only executes the first time it appears on the screen
      setPreviewReq(true);
    }
    return () => cancelRequest(`p-${intel.storageid}-${intel.simhash}`);
  }, [isIntersecting]);

  const formatDate = formatDateTimeFormat(intel.date);
  return (
    <article ref={ref} className="intel-data-card" onClick={() => readFile(intel)}>
      <header className="intel-data-header">
        <div className="title-container">
          <h3 className="intel-header-title" title={intel.name}>
            {intel.name.slice(0, 50)}
          </h3>
        </div>
        <div className="secondary-title">
          <h4 className="intel-header-title intel-secondary-title">{intel.bucket}</h4>
          <span className="intel-header-text" title={formatDate}>
            {formatDate}
          </span>
        </div>
      </header>

      <section className="intel-data-content">
        <InxPreviousContentData
          loading={isLoadingPreview}
          preview={intelPreview}
          storageID={intel.storageid}
        />
      </section>
    </article>
  );
};
