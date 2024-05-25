import { useFetcher } from "#commonHooks/useFetcher"
import { COMUNIQUE_KEYS } from "@/app/constants/app-texts";

export const useSolvedComunique = ()=>{
    const [fetcher, _, isLoading] = useFetcher();

    const solvedComunique = ()=>{
        const id = localStorage.getItem(COMUNIQUE_KEYS.ID) || "";

        fetcher("post", {
            body: {
                model: "users/communiques/solved",
                id: id
            }
        });
    }

    return {solvedComunique};
}