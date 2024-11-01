import { type FC } from 'react';
import {
  PageLoader,
  PreviousMessageIcon,
  PrimaryButton,
  Show,
  SimpleSection,
} from '../../../../../components';
import { type PreviousSearch, generateIDArray } from '../../../../../../data';

interface InxPreviousSearchesProps {
  isLoading: boolean;
  previousSearches: PreviousSearch[];
}

export const InxPreviousSearches: FC<InxPreviousSearchesProps> = ({
  isLoading,
  previousSearches,
}) => {
  const safelyPreviousSearches = () =>
    Array.isArray(previousSearches) ? previousSearches.reverse() : [];

  const previusKeys = generateIDArray(safelyPreviousSearches().length);

  return (
    <>
      <div className="previous-search">
        <div className="card table inx">
          <SimpleSection header="Previous Searches" icon={<PreviousMessageIcon />}>
            <>
              <div className="columns-name">
                <div className="column">username</div>
                <div className="column">search</div>
              </div>

              <div className="rows internal-tables ">
                {!isLoading ? (
                  safelyPreviousSearches().map((searchData: PreviousSearch, i: number) => (
                    <div className="item-wrapper" key={previusKeys[i]}>
                      <section className="search-item">
                        <p className="name">{searchData.username}</p>
                        <p className="result">{searchData.info.split('queries:')[1] ?? '--'}</p>
                      </section>
                    </div>
                  ))
                ) : (
                  <PageLoader />
                )}
              </div>
            </>
          </SimpleSection>
        </div>
      </div>
    </>
  );
};
