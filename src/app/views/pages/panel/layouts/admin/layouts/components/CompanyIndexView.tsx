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

	const { companies, isSelectedCompany, updateCompanies } =
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
	});

	return (
		<>
			<div className="CompanyIndexView">
				{companies.length > 0 && (
					<div className="companies">
						{companies.map((company: AdminCompany) => (
							<div
								onClick={() =>
									isSelectedCompany(company)
										? navigate('/dashboard')
										: selectCompany(company)
								}
								key={company.id}
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
