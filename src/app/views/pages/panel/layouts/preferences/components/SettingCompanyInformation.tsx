import { CompanyInfo, usePreferences } from '../../../../../../data';
import { useCompany } from '../../../../../../data/hooks/useCompany';
import React from 'react';

interface CompanyDataProps {
  companyInfo: CompanyInfo | '';
}

const SettingCompanyInformation: React.FC<CompanyDataProps> = () => {
  const { company } = usePreferences();

  const getCompanyData = () => {
    if (!company) {
      return {
        name: '',
        web: '',
        mercado: '',
        owner: '',
        email: '',
        location: '',
        address: '',
      };
    }

    return {
      name: company.owner_fname,
      web: company.web,
      mercado: company.mercado,
      owner: `${company.owner_fname} ${company.owner_lname}`,
      email: company.owner_email,
      location: company.pais_provincia,
      address: `${company.address === 'non available' ? '-' : company.address}`,
    };
  };

  return (
    <>
      <div className="w-full internal-tables">
        <div className="py-3 px-5 internal-tables-active flex flex-row items-center gap-x-6 ">
          <p className="text-small text-left font-bold title-format">
            COMPANY INFORMATION
          </p>
          <p className="text-small text-left font-bold title-format border-x-[1.5px]  title-format px-6 underline cursor-pointer codefend-text-red">
            UPDATE
          </p>
        </div>
        <div className="flex px-8 py-2">
          <div className="w-full">
            {Object.entries(getCompanyData()).map((data, index) => (
              <div key={index} className="flex px-3 py-1 text-format">
                <section className="flex w-full items-center">
                  <p className="w-2/4">{data[0]}</p>
                  <p className="text-base w-2/4">{data[1]}</p>
                </section>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingCompanyInformation;
