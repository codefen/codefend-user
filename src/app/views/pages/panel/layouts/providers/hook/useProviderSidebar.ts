import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export enum ProviderSidebarOptions {
	ABOUT,
	ORDERS,
	EXPERIENCES,
	EDUCATION,
}

export const useProviderSidebar = ()=>{
	const location = useLocation();
	const active = location.pathname.split("/")[2];
    const [sidebarOption, setSidebarOption] = useState(active);
	useEffect(()=>{
		const active = location.pathname.split("/")[2];
		setSidebarOption(active);
	}, [location]);

    return [sidebarOption] as const;
}