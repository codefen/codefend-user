import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";

export const useAddResourceCredentials = ()=>{
    const { getCompany, logout } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();

    const addCrdentials = (type: string, id: string, username: string, email:string, password: string,accessLevel:string, grades:string)=>{
        fetcher("post", {
            body: {
                company: getCompany(),
                resource_class: type,
                resource_id: id,
                email: email,
                username: username,
                password: password,
                access_level: accessLevel,
                info: grades
            }
        }).then(({data}:any)=>{
            if(data.error != "0")
				throw new Error("");
        });
    }

    return {addCrdentials, isLoading};
}