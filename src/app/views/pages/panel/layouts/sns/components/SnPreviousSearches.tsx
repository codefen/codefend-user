import { type FC } from 'react';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import { SimpleSection } from '@defaults/SimpleSection.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { PreviousMessageIcon } from '@icons';

interface SnPreviousSearchesProps {
  isLoading: boolean;
  previousSearches: any[];
}

const SnPreviousSearches: FC<SnPreviousSearchesProps> = ({ isLoading, previousSearches }) => {
  const safelyPreviousSearches = () => (Array.isArray(previousSearches) ? previousSearches : []);
  return (
    <div className="previous-search">
      <div className="card table inx">
        <SimpleSection header="Previous Searches" icon={<PreviousMessageIcon />}>
          <>
            <div className="columns-name">
              <div className="column">username</div>
              <div className="column">search</div>
            </div>

            <div className="rows internal-tables ">
              <Show when={!isLoading} fallback={<PageLoader />}>
                {safelyPreviousSearches().map((searchData, i) => (
                  <div className="item-wrapper" key={`sd-${i}`}>
                    <section className="search-item">
                      <p className="name">{searchData.info.split('class:')[1] || '--'}</p>
                      <p className="result">{searchData.info.split('queries:')[1] || '--'}</p>
                    </section>
                  </div>
                ))}
              </Show>
            </div>
          </>
        </SimpleSection>
      </div>
    </div>
  );
};

export default SnPreviousSearches;
