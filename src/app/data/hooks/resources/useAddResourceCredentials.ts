import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";
import { apiErrorValidation, hasEmail } from "@/app/constants/validations";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useAddResourceCredentials = ()=>{
    const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const userNameOrEmail = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const accessLevel = useRef<HTMLSelectElement>(null);
	const grades = useRef<HTMLTextAreaElement>(null);


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
		const vUsernameOrEmail = userNameOrEmail.current?.value || "";
		return addCrdentials(
			type,
			resourceId,
			!hasEmail(vUsernameOrEmail)
			? vUsernameOrEmail
			: '',
			hasEmail(vUsernameOrEmail) ? vUsernameOrEmail : '',
			password.current?.value || "",
			accessLevel.current?.value || "",
			grades.current?.value || "",
		)
			.then(() => {
				toast.success('Credential added successfully');
				return true;
			})
			.catch(() => {
				toast.error('Something went wrong');
				return false;
			});
	};


    return {handleSend, isLoading, userNameOrEmail, password, accessLevel, grades};
}