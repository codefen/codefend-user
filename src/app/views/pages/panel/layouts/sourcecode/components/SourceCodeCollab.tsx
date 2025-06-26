import { type FC } from 'react';
import { SearchIcon } from '@icons';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

export const SourceCodeCollab: FC = () => {
  return (
    <>
      <div className="card only-info">
        <SimpleSection header="Add your repository" icon={<SearchIcon />}>
          <div className="content">
            <div className="info">
              <p className="collab-info">
                In order to review the source code in your company private repositories we will need
                contributor access. Please add the following user: &nbsp;
                <a className="codefend-text-red email-collab">sourcecode@codefend.com</a>
              </p>
            </div>
          </div>
        </SimpleSection>
      </div>
    </>
  );
};
