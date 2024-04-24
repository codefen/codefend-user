import { useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';

interface SocialData {
	fName: string;
	lName: string;
	mail: string;
	phone: string;
	role: string;
	isAddingMember: boolean;
}

export const useAddSocial = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [socialData, setSocialData] = useState<SocialData>({
		fName: '',
		lName: '',
		mail: '',
		phone: '',
		role: '',

		isAddingMember: false,
	});
	const { fName, isAddingMember, lName, mail, phone, role } = socialData;
	const [fetcher, cancelRequest, isLoading] = useFetcher();

	const validations = () => {
		if (!fName.trim() || fName.length > 40) {
			toast.error('Invalid name');
			return true;
		}

		if (!lName.trim() || lName.length > 40) {
			toast.error('Invalid name');
			return true;
		}

		let regexMail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,10}$/;
		if (!mail.trim() || mail.length === 0 || !regexMail.test(mail)) {
			toast.error('Invalid email');
			return true;
		}

		if (!phone || phone.length == 0 || phone.length > 20) {
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
			},
		}).then(({ data }: any) => {
			if(data.error != "0" || data.response == "error"){
				throw new Error("");
			}
			onDone();
			toast.success('Successfully Added Member...');
		}).catch((err:Error)=> toast.error("Unexpected server error when trying to add the social resource"));
	};

	const handleAddSocialResource = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
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
