import { useState } from "react";
import { useFetcher } from "./useFetcher";
import { useAuthState } from "..";

export const useMessageState = ()=>{
    const [message, setMessage] = useState<string>('');
    const [fetcher,_, isLoading] = useFetcher();
    const { getUserdata, getCompany } = useAuthState();
    return {message, isLoading, getCompany, getUserdata, setMessage, fetcher} as const;
}