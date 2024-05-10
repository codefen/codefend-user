import { type FC, useEffect } from 'react';
import CompanyCard from './CompanyCard.tsx';
import useAdminCompanyStore from '@stores/adminCompany.store.ts';
import { type AdminCompany } from '@stores/adminCompany.store.ts';
import './CompanyIndexView.scss';
import { useGetCompany } from '@userHooks/admins/useGetCompany';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';

const CompanyIndexView: FC = () => {
	const { isAdmin } = useUserRole();
	const { getCompany } = useGetCompany();
	const { companies, companySelected, isSelectedCompany, updateCompanies } =
		useAdminCompanyStore((state) => state);

	const { selectCompany } = useAdminCompanyStore((state) => state);

	useEffect(() => {
		if (isAdmin()) {
			getCompany().then(({ data }: any) => {
				updateCompanies(data.companies);
			});
		}
		if (isAdmin() && !companySelected) {
			selectCompany(companies[0] || undefined);
		}
	}, []);

	return (
		<div className="CompanyIndexView">
			{Boolean(companies.length) && (
				<div className="companies">
					{companies.map((company: AdminCompany) => (
						<div
							key={company.id}
							onClick={() => selectCompany(company)}
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
	);
};

export default CompanyIndexView;
