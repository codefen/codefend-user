import { useState } from "react";

export enum ProviderSidebarOptions {
	ABOUT,
	ORDERS,
	EXPERIENCES,
	EDUCATION,
}

export const useProviderSidebar = ()=>{
    const [sidebarOption, setSidebarOption] = useState(ProviderSidebarOptions.ABOUT);
    const updateSidebarOption = (updated: number) => {
		setSidebarOption(updated);
	};

    return [sidebarOption, updateSidebarOption] as const;
}