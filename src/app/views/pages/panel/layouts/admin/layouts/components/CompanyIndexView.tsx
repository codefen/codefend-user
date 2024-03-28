import { type FC, useEffect } from 'react';
import CompanyCard from './CompanyCard';
import {
	type AdminCompany,
	useAdminCompanyStore,
	companyServices,
} from '../../../../../../../data';
import './CompanyIndexView.scss';
import { useNavigate } from 'react-router';

const CompanyIndexView: FC = () => {
	const navigate = useNavigate();

	const { companies, companySelected, isSelectedCompany, updateCompanies } =
		useAdminCompanyStore((state) => state);

	const { selectCompany, updateSearch } = useAdminCompanyStore(
		(state) => state,
	);

	useEffect(() => {
		if (companies.length === 0) {
			companyServices.getCompanies(1).then((data: any) => {
				updateCompanies(data.companies);
			});
		}
		if (!companySelected) {
			selectCompany(companies[0] || undefined);
		}
	});

	return (
		<>
			<div className="CompanyIndexView">
				{Boolean(companies.length) && (
					<div className="companies">
						{companies.map((company: AdminCompany) => (
							<div
								key={company.id}
								onClick={() =>
									isSelectedCompany(company)
										? navigate('/dashboard')
										: selectCompany(company)
								}
								className={`company ${
									isSelectedCompany(company) ? 'selected' : ''
								}`}>
								<CompanyCard
									company={company}
									isSelected={isSelectedCompany(company)}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default CompanyIndexView;
