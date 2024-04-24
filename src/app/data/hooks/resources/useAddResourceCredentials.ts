import { useFetcher } from "#commonHooks/useFetcher";
import { useUserData } from "#commonUserHooks/useUserData";

export const useAddResourceCredentials = ()=>{
    const { getCompany, logout } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();

    const addCrdentials = (type: string, id: string, username: string, email:string, password: string,accessLevel:string, grades:string)=>{
        return fetcher("post", {
            body: {
                model: "creds/add",
                ac: "add",
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
            if(data.error != "0" || data.response == "error")
				throw new Error("");

            return true;
        }).catch(()=>{
            return false;
        });
    }

    return {addCrdentials, isLoading};
}