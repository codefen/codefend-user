import { type FC } from 'react';
import { type CompanyInfo, formatDate } from '../../../../../../data';

interface CompanyDataProps {
  companyInfo: CompanyInfo;
}

const SettingCompanyInformation: FC<CompanyDataProps> = ({ companyInfo }) => {
  const companyImportantData = {
    ['company name']: companyInfo.name,
    web: companyInfo.web || '---',
    country: companyInfo.pais || '---',
    province: companyInfo.pais_provincia || '---',
    ['owner name']: companyInfo.owner_fname
      ? `${companyInfo.owner_fname} ${companyInfo.owner_lname}`
      : '---',
    ['owner email']: companyInfo.owner_email || '---',
    ['created at']: formatDate(companyInfo.creacion),
  };
  return (
    <div className="table-company-data internal-tables">
      <div className="internal-tables-active company-data-header">
        <p className="text-small title-format">COMPANY INFORMATION</p>
      </div>
      <div className="company-data-main">
        <div className="company-data-main-wrapper">
          {Object.entries(companyImportantData).map((data, index) => (
            <div key={index} className="company-table-content text-format">
              <section className="company-data-content">
                <p>{data[0]}</p>
                <p>{data[1]}</p>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingCompanyInformation;
