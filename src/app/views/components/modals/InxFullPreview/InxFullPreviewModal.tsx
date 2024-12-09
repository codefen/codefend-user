import ModalTitleWrapper from '@modals/modalwrapper/ModalTitleWrapper';
import { useHighlightLinesWithUrl } from '@moduleHooks/inx';

interface InxFullPreviewModalProps {
  results?: string;
  fileName?: string;
  fileType?: string;
  search?: string;
  open: boolean;
  close: () => void;
}

const InxFullPreviewModal = ({
  results = '',
  open,
  close,
  fileName = '',
  fileType = '',
  search = '',
}: InxFullPreviewModalProps) => {
  const { highlightWithUrl } = useHighlightLinesWithUrl();

  return (
    <ModalTitleWrapper
      close={close}
      headerTitle="Full preview data"
      isActive={Boolean(results) && open}>
      <div className="full-preview-container">
        <div className="full-preview-header">
          <h2 className="full-preview-title">
            {fileName}, {fileType}
          </h2>
        </div>

        <div className="full-preview-content">
          <h3 className="preview-content-title">Main results</h3>

          <div
            className="preview-content"
            dangerouslySetInnerHTML={{
              __html: highlightWithUrl(results, search),
            }}></div>

          <hr className="preview-dash "></hr>

          <h3 className="preview-content-title">Full list</h3>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{
              __html: results ? results.replace(/(\r\n|\n|\r)/g, '<br>') : '',
            }}></div>
        </div>
      </div>
    </ModalTitleWrapper>
  );
};

export default InxFullPreviewModal;
