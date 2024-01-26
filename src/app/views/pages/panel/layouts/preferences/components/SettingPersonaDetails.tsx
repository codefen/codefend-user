import { defaultPersonalDetails } from '../../../../../../data';
import { useCompany } from '../../../../../../data/hooks/useCompany';

import {  Show } from '../../../../../../views/components';
import React, { useState } from 'react';

interface DetailProps {
	title: string;
	value: string
}

const SettingPersonalDetails: React.FC = (props) => {
	const [personalDetails, setPersonalDetails] = useState<DetailProps[]>(
    defaultPersonalDetails
  );

	const { companyInfo } = useCompany();

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
				email:companyInfo.owner_email,
				firstname: companyInfo.owner_fname,
				lastname: companyInfo.owner_lname,
				phone: companyInfo.owner_phone,
				role: companyInfo.owner_role,
				photo_media: companyInfo.profile_media,
			};
		};

	return (
		<>
			<div className=" personal-details w-full internal-tables mt-6 ">
				<div className="py-3 px-5 internal-tables-active flex flex-row items-center gap-x-6 ">
					<p className="text-small text-left font-bold title-format">
						YOUR PERSONAL DETAILS
					</p>
					<p className="text-small text-left font-bold title-format border-x-[1.5px]  px-6 underline cursor-pointer title-format codefend-text-red">
						UPDATE
					</p>
				</div>
				<div className="flex flex-row gap-x-7 items-center px-8 py-2">
					<section className="flex  mb-20">
						<Show
							when={Boolean(userInfo().photo_media)}
							fallback={
								<img
									src="/codefend/user-icon-gray.svg"
									className="w-16 h-16"
									alt="default-profile-icon"
								/>
							}>
							<div className="w-16 h-16 rounded-full profile-picture-wrapper">
								<img
									src={userInfo().photo_media ?? ''}
									alt="profile-picture"
									className=" rounded-full overflow-hidden"
								/>
							</div>
						</Show>
					</section>
					<div className="w-full mb-20">
						{personalDetails.map((detail: DetailProps) => (
							<div
								key={detail.title}
								className="flex px-2 py-1 text-format">
								<section className="flex w-full items-center">
									<p className="w-[40%]">{detail.title}</p>
								 	<p className="text-base w-1/2">
										{detail.value}
									</p> 
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
