import { useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNotNull, nameValidation, phoneNumberValidation, emailRegexVal } from '@/app/constants/validations';

interface SocialData {
	fName: string;
	lName: string;
	mail: string;
	phone: string;
	role: string;
}

export const useAddSocial = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [socialData, setSocialData] = useState<SocialData>({
		fName: '',
		lName: '',
		mail: '',
		phone: '',
		role: '',
	});
	const { fName, lName, mail, phone, role } = socialData;
	const [fetcher, _, isLoading] = useFetcher();

	const validations = () => {
		if (nameValidation(fName)) {
			toast.error('Invalid name');
			return true;
		}

		if (nameValidation(lName)) {
			toast.error('Invalid name');
			return true;
		}

		if (mail.trim() !== "" && !emailRegexVal.test(mail)) {
			toast.error('Invalid email');
			return true;
		}

		if (phoneNumberValidation(phone)) {
			toast.error('Invalid phone');
			return true;
		}

		if (!role) {
			toast.error('Invalid role');
			return true;
		}
		return false;
	};

	const fetchAdd = (companyID: string) => {
		fetcher<any>('post', {
			body: {
				model: 'resources/se',
				ac: 'add',
				company_id: companyID,
				member_fname: fName,
				member_lname: lName,
				member_email: mail,
				member_phone: phone,
				member_role: role,
			}
		}).then(({ data }: any) => {
			if(apiErrorValidation(data.error, data.response)){
				throw new Error("");
			}
			onDone();
			toast.success('Successfully Added Member...');
		}).catch((err:Error)=> toast.error("Unexpected server error when trying to add the social resource"));
	};

	const handleAddSocialResource = () => {
		const companyID = getCompany();
		if (companyIdIsNotNull(companyID)) return;
		fetchAdd(companyID);
	};

	return {
		role,
		isAddingMember: isLoading,
		setSocialData,
		handleAddSocialResource,
		validations,
	};
};
