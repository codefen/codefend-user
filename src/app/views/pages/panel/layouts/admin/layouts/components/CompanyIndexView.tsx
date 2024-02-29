import React, { useMemo, useEffect, useState } from 'react';
import CompanyCard from './CompanyCard';
import { RigthArrowIcon, Show } from '../../../../../../components';
import { AdminCompany, useAdminCompanyStore, companyServices } from '../../../../../../../data';
import './CompanyIndexView.scss';
import { useNavigate } from 'react-router';

const CompanyIndexView: React.FC = () => {
	const { searchQuery, companies, isSelectedCompany, updateCompanies } = useAdminCompanyStore(
		(state) => state,
	);

	const { selectCompany, updateSearch } = useAdminCompanyStore(
		(state) => state,
	);

	//const [companies, setCompanies] = useState([]);

	useEffect(() => {
		if(companies.length === 0) {
			companyServices.getCompanies(1)
				.then((data: any) => {
					updateCompanies(data.companies);
				})
		}
	});



	const companiesToRender = useMemo(() => {
		if (searchQuery.trim() === '' || searchQuery.trim().length < 2)
			return companies;

		const _companies = companies;
		const query = searchQuery;

		return _companies.filter((company: AdminCompany) =>
			company.name.toLowerCase().includes(query.toLowerCase()),
		);
	}, [searchQuery, companies]);
	const navigate = useNavigate();

	return (
		<>
			<div className="CompanyIndexView">
				{companies.length > 0 && (
					<div className="companies">
						{companies.map((company: AdminCompany) => (
							<div
								onClick={() => isSelectedCompany(company) ? navigate('/dashboard') : selectCompany(company)}
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
