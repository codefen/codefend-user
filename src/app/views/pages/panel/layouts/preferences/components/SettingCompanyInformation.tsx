import React from 'react';
import { type CompanyInfo, usePreferences } from '../../../../../../data';

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
			address: `${
				company.address === 'non available' ? '-' : company.address
			}`,
		};
	};

	return (
		<>
			<div className="table-company-data internal-tables">
				<div className="internal-tables-active company-data-header">
					<p className="text-small title-format">COMPANY INFORMATION</p>
					<p className="text-small title-format title-format codefend-text-red">
						UPDATE
					</p>
				</div>
				<div className="company-data-main">
					<div className="company-data-main-wrapper">
						{Object.entries(getCompanyData()).map((data, index) => (
							<div
								key={index}
								className="company-table-content text-format">
								<section className="company-data-content">
									<p>{data[0]}</p>
									<p>{data[1]}</p>
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
