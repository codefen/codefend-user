import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation } from "@/app/constants/validations";
import { useState } from "react";
import { toast } from "react-toastify";

export const useAddResourceCredentials = ()=>{
    const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const [credentials, setCredentials] = useState({
		userNameOrEmail: '',
		password: '',
		accessLevel: '',
		grades: '',
	});

    const addCrdentials = (type: string, id: string, username: string, email:string, password: string,accessLevel:string, grades:string)=>{
        return fetcher("post", {
            body: {
                model: "creds/add",
                company_id: getCompany(),
                resource_class: type,
                resource_id: id,
                email: email,
                username: username,
                password: password,
                access_level: accessLevel,
                info: grades
            }
        }).then(({data}:any)=>{
            if (apiErrorValidation(data?.error, data?.response))
				throw new Error("");

            return true;
        }).catch(()=>{
            return false;
        });
    }

    const handleSend = (type: string, resourceId: string) => {
		const { userNameOrEmail, password, grades, accessLevel } = credentials;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const username = !emailPattern.test(userNameOrEmail)
			? userNameOrEmail
			: '';
		const email = emailPattern.test(userNameOrEmail) ? userNameOrEmail : '';

		addCrdentials(
			type,
			resourceId,
			username,
			email,
			password,
			accessLevel,
			grades,
		)
			.then(() => {
				toast.success('Credential added successfully');
			})
			.catch(() => {
				toast.error('Something went wrong');
			});
	};


    return {handleSend, setCredentials, isLoading};
}