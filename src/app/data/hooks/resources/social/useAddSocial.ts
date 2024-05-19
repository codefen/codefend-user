import { useRef } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, nameValidation, phoneNumberValidation, emailRegexVal } from '@/app/constants/validations';

const validations = (fName:string,lName:string,mail:string,phone:string,role:string) => {
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

export const useAddSocial = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const fName = useRef<HTMLInputElement>(null);
	const lName = useRef<HTMLInputElement>(null);
	const mail = useRef<HTMLInputElement>(null);
	const phone = useRef<HTMLInputElement>(null);
	const role = useRef<HTMLSelectElement>(null);
	
	const [fetcher, _, isLoading] = useFetcher();

	const fetchAdd = (companyID: string) => {
		fetcher<any>('post', {
			body: {
				model: 'resources/se',
				ac: 'add',
				company_id: companyID,
				member_fname: fName.current?.value || "",
				member_lname: lName.current?.value || "",
				member_email: mail.current?.value || "",
				member_phone: phone.current?.value || "",
				member_role: role.current?.value || "",
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
		if (companyIdIsNull(companyID) || validations(fName.current?.value || "",lName.current?.value || "",mail.current?.value || "",phone.current?.value || "",role.current?.value || "")) return;
		fetchAdd(companyID);
	};

	return {
		isAddingMember: isLoading,
		handleAddSocialResource,
		fName,
		lName,
		mail,
		phone,
		role
	};
};
