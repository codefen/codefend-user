import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

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
            if(data.error != "0" || data.response == "error") throw new Error("");

            toast.success("The invitation has been sent the invitation to the email");
		}).catch(()=>{
            toast.error("An error has occurred with the server and we have not been able to send the invitation");
        });
	};


	return { sendAddCollaborator, isLoading };
};
