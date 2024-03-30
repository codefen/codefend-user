import { useRef, useState } from "react"
import { useFetcher } from "../util/useFetcher";
import { useAuthState } from "../useAuthState";
import { useLocation } from "react-router";
import { toast } from "react-toastify";

interface PersonInfo {
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	gender?: string;
	lastip?: string;
	username?: string;
	country?: string;
	created?: string;
	followers?: string;
	hash?: string;
	id?: string;
	birthdate?: string;
	regdate?: string;
	uid?: string;
	[key: string]: any;
}

export const useSns = ()=>{
    const { getCompany, getUserdata } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
    const query = new URLSearchParams(useLocation().search);
	const [searchData, setSearchData] = useState(query.get('search') || '');
    const [searchClass, setSearchClass] = useState<string>(
		query.get('class') ?? '',
	);
    const intelDataRef = useRef<any[]>([]);

    const fetchSearch = (companyID: string)=>{
        intelDataRef.current = [];
        fetcher("post", {
            body: {
                model: 'modules/sns',
                ac: 'search',
                company_id: companyID,
                keyword: searchData,
				class: searchClass,
            }
        }).then((res: any) => {
            const arrayOfObjects = Object.entries(res.response.results).map(
                ([key, value]) => {
                    const name = key.split('_').slice(1, -2).join('_');
                    return { name, value: value as PersonInfo[] };
                },
            );
            intelDataRef.current = arrayOfObjects;
        })
    }

    const handleSearch = ()=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
        fetchSearch(companyID);
    }

    return { searchData, searchClass, isLoading, intelData: intelDataRef.current,handleSearch, getUserdata, setSearchData, setSearchClass } as const;
}