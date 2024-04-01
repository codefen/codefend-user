import React, { useState } from 'react';
import { defaultPersonalDetails } from '@mocks/defaultData.ts';
import Show from '@defaults/Show.tsx';
import useGetAllCompanies from '@userHooks/admins/useGetAllCompanies.ts';

interface DetailProps {
	title: string;
	value: string;
}

const SettingPersonalDetails: React.FC = (props) => {
	const [personalDetails, setPersonalDetails] = useState<DetailProps[]>(
		defaultPersonalDetails,
	);

	const { companyInfo } = useGetAllCompanies();

	const userInfo = () => {
		if (!companyInfo) {
			return {
				email: '',
				fname: '',
				mercado: '',
				owner: '',
				location: '',
				address: '',
			};
		}

		return {
			email: companyInfo.owner_email,
			firstname: companyInfo.owner_fname,
			lastname: companyInfo.owner_lname,
			phone: companyInfo.owner_phone,
			role: companyInfo.owner_role,
			photo_media: companyInfo.profile_media,
		};
	};

	return (
		<>
			<div className="table-personal-data personal-details internal-tables">
				<div className="personal-data-header internal-tables-active">
					<p className="text-small title-format">YOUR PERSONAL DETAILS</p>
					<p className="text-small title-format update-btn title-format codefend-text-red">
						UPDATE
					</p>
				</div>
				<div className="personal-data-content">
					<section className="personal-data-container personal-header">
						<Show
							when={Boolean(userInfo().photo_media)}
							fallback={
								<img
									src="/codefend/user-icon-gray.svg"
									className="img-fallback"
									alt="default-profile-icon"
								/>
							}>
							<div className="img-container profile-picture-wrapper">
								<img
									src={userInfo().photo_media ?? ''}
									alt="profile-picture"
								/>
							</div>
						</Show>
					</section>
					<div className="personal-main">
						{personalDetails.map((detail: DetailProps) => (
							<div
								key={detail.title}
								className="personal-main-content text-format">
								<section className="main-content-wrapper">
									<p className="content-detail">{detail.title}</p>
									<p className="content-value">{detail.value}</p>
								</section>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default SettingPersonalDetails;
