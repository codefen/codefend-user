import React, { useMemo } from 'react';
import CompanyCard from './CompanyCard';
import { RigthArrowIcon } from '../../../../../../components';
import { AdminCompany, useAdminCompanyStore } from '../../../../../../../data';
import './CompanyIndexView.scss';

const CompanyIndexView: React.FC = () => {
	const { searchQuery, companies, isSelectedCompany } = useAdminCompanyStore(
		(state) => state,
	);
	const { selectCompany, updateSearch } = useAdminCompanyStore(
		(state) => state,
	);

	const companiesToRender = useMemo(() => {
		if (searchQuery.trim() === '' || searchQuery.trim().length < 2)
			return companies;

		const _companies = companies;
		const query = searchQuery;

		return _companies.filter((company: AdminCompany) =>
			company.name.toLowerCase().includes(query.toLowerCase()),
		);
	}, [searchQuery, companies]);

	return (
		<>
			<div className="CompanyIndexView">
				{Boolean(companies.length) && (
					<div className="company-search relative">
						<input
							type="text"
							name="searchQuery"
							value={searchQuery}
							onChange={(e) => updateSearch(e.target.value)}
							placeholder="Search Company"
							className="text w-full"
							required
						/>
						<div
							className="h-full absolute codefend-text-red flex items-center justify-center right-5"
							style={{ color: 'black' }}>
							<RigthArrowIcon width={2} height={2} />
						</div>
					</div>
				)}
				<div className="companies">
					{companiesToRender.map((company: AdminCompany) => (
						<div
							onClick={() => selectCompany(company)}
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
			</div>
		</>
	);
};

export default CompanyIndexView;
