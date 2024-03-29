import { useEffect, useState } from "react";

export const useShowScreen = ()=>{
    const [showScreen, setShowScreen] = useState(false);
    const [control, setControl] = useState<boolean>(false);

    useEffect(()=>{
        setShowScreen(false);

        const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
    }, [control]);

    const refresh = ()=>{
        setControl(!control);
    }

    return [showScreen, control, refresh] as const;
}