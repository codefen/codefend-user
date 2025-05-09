import { type FC } from 'react';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { PreviousMessageIcon } from '@icons';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

interface SnPreviousSearchesProps {
  isLoading: boolean;
  previousSearches: any[];
}

const SnPreviousSearches: FC<SnPreviousSearchesProps> = ({ isLoading, previousSearches }) => {
  const safelyPreviousSearches = () => (Array.isArray(previousSearches) ? previousSearches : []);
  return (
    <div className="previous-search">
      <div className="card table inx">
        <SimpleSection
          header={
            <span style={{ fontSize: 20, color: '#444', fontWeight: 600 }}>Previous Searches</span>
          }>
          <>
            <div className="columns-name">
              <div className="column">Date</div>
              <div className="column">Class</div>
              <div className="column">Keyword</div>
            </div>

            <div className="rows internal-tables ">
              <Show when={!isLoading} fallback={<PageLoader />}>
                {safelyPreviousSearches().map((searchData, i) => (
                  <div className="item-wrapper" key={`sd-${i}`}>
                    <section className="search-item">
                      <div className="name">
                        <span style={{ fontWeight: 600 }}>
                          {searchData.date || searchData.created_at || '--'}
                        </span>
                      </div>
                      <div className="result">
                        {searchData.info && searchData.info.includes('class:')
                          ? searchData.info.split('class:')[1].split(',')[0].trim()
                          : '--'}
                      </div>
                      <div className="keyword">
                        {searchData.info && searchData.info.includes('queries:')
                          ? searchData.info.split('queries:')[1].split(',')[0].trim()
                          : searchData.keyword || '--'}
                      </div>
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
