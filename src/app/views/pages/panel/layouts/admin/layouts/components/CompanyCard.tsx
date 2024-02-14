import React from 'react';
import { useNavigate } from 'react-router';
import { CompanyIcon, Show } from '../../../../../../components';
import { AdminCompany } from '../../../../../../../data';

interface CompanyCard {
	isSelected: boolean;
	company: AdminCompany;
}

const CompanyCard: React.FC<CompanyCard> = ({ company, isSelected }) => {
	const navigate = useNavigate();
	return (
		<>
			<div className="pointer-events-none company-card">
				<div>
					<div className="img-wrapper codefend-text-red">
						<Show
							when={!company.profileMedia}
							fallback={<img src="" alt="company-icon" />}>
							<CompanyIcon width={2.838} height={2.838} />
						</Show>
					</div>
				</div>
				<div className="company-detail">
					<span className="font-bold text-[18px]">
						{company.name ?? 'Company Name'}
					</span>

					<div className="mt-2 flex flex-col">
						<span>ID: {company.id ?? 'Company ID'}</span>
						<span className="company-web">
							{company.website ?? 'Company Website'}
						</span>
					</div>
					<a
						href="/dashboard"
						className={`pointer-events-auto link underline z-100 ${
							isSelected ? 'visible' : 'invisible'
						}`}
						onClick={(e) => {
							e.preventDefault();
							navigate('/dashboard');
						}}>
						Go to Company Dashboard
					</a>
				</div>
			</div>
		</>
	);
};

export default CompanyCard;
