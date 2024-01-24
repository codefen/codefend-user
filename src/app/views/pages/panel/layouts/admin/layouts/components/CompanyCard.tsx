import { CompanyIcon } from '../../../../../../components';
import React from 'react';
import { useNavigate } from 'react-router';
interface Company {
	id: string;
	image?: string;
	name: string;
	size: string;
	website: string;
	country: string;
	city: string;
	isSelected?: boolean;
}

const CompanyCard: React.FC<Company> = (props) => {
	const navigate = useNavigate();
	return (
		<>
			<div className="pointer-events-none company-card">
				<div>
					<div className="img-wrapper codefend-text-red">
						{props.image ? (
							<img src="" alt="company-icon" />
						) : (
							<CompanyIcon width={3} height={3} />
						)}
					</div>
				</div>
				<div className="company-detail">
					<span className="font-bold text-[18px]">
						{props.name ?? 'Company Name'}
					</span>

					<div className="mt-2 flex flex-col">
						<span>ID: {props.id ?? 'Company ID'}</span>
						<span>{props.website ?? 'Company Website'}</span>
					</div>
					<a
						href="/dashboard"
						className={`pointer-events-auto link underline z-100 ${
							props.isSelected ? 'visible' : 'invisible'
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
