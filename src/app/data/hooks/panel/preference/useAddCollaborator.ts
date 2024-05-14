import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation } from '@/app/constants/validations';

/* Custom Hook "usePreferences" to handle retrieving all user preferences*/
export const useAddCollaborator = () => {
	const { getCompany} = useUserData();
	const [fetcher, _, isLoading] = useFetcher(true);


	const sendAddCollaborator = (email: string) => {
		return fetcher("post", {
			body: {
				model: 'users/invoke',
				company_id: getCompany() || "",
                invoke_user_email: email
			}
		}).then(({ data }: any) => {
			if (apiErrorValidation(data?.error, data?.response)) {
				throw new Error('');
			}

            toast.success("The invitation has been sent the invitation to the email");
		}).catch(()=>{
            toast.error("An error has occurred with the server and we have not been able to send the invitation");
        });
	};


	return { sendAddCollaborator, isLoading };
};
