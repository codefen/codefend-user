import { cleanHTML } from '@utils/helper';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { type FC } from 'react';

interface InxPreviousContentDataProps {
  preview: any;
  storageID: any;
  loading: boolean;
}

export const InxPreviousContentData: FC<InxPreviousContentDataProps> = ({
  preview,
  storageID,
  loading,
}) => {
  //Retrieves the preview to show it if the storage IDs match
  const previewHTML = preview

    .find((preview: any) => preview.id === storageID)
    ?.preview?.replace(/█/g, '-')
    ?.split(/\r?\n/)
    .map((line: any) => {
      const parts = line.split('\t');
      if (parts.length === 3) {
        const [domain, owner, email] = parts;
        return `<p><strong>${domain}</strong>: ${owner} - ${email}</p>`;
      } else {
        return `<p>${line}</p>`;
      }
    })

    .join('');

  return (
    <Show
      when={!loading}
      fallback={
        <div className="loader">
          <PageLoader />
        </div>
      }>
      <div
        className="intel-preview-container"
        dangerouslySetInnerHTML={{
          __html: previewHTML ? cleanHTML(previewHTML) : 'There are no previews yet',
        }}
      />
    </Show>
  );
};
