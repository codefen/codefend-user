import { type FC } from 'react';
import { CompanyIcon, Show } from '../../../../../../components';
import { type AdminCompany } from '../../../../../../../data';

interface CompanyCard {
  isSelected: boolean;
  company: AdminCompany;
}

const CompanyCard: FC<CompanyCard> = ({ company, isSelected }) => {
  return (
    <>
      <div className="company-card">
        <div>
          <div className="img-wrapper codefend-text-red">
            <Show
              when={!company.profile_media}
              fallback={
                <img
                  src={`data:image/png;base64,${company.profile_media}`}
                  alt="company-icon"
                  decoding="async"
                  loading="lazy"
                />
              }>
              <CompanyIcon width={2.838} height={2.838} />
            </Show>
          </div>
        </div>
        <div className="company-detail">
          <span className="company-name">{company.name || 'Company Name'}</span>
          <div className="company-id">
            <span>ID: {company.id || 'Company ID'}</span>
            <span className="company-web">{company.mercado || 'Company Category'}</span>
            <span className="company-web" title={company.web || 'Company Website'}>
              {company.web || 'Company Website'}
            </span>
          </div>

          <a href="/dashboard" className={`link ${isSelected ? 'visible' : ''}`}></a>
        </div>
      </div>
    </>
  );
};

export default CompanyCard;
