import { useCallback, useEffect, useRef } from "react";

const useTimeout = (callback: ()=>void, delay:number)=> {
    const timeoutRef = useRef<NodeJS.Timeout>();

    const clear = () => {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
    };

    useEffect(() => {
        return clear;
    }, []);

    const oneExecute = ()=>{
        clear();
        if(timeoutRef.current == undefined){
            timeoutRef.current = setTimeout(callback, delay);
        }
    }

    return { clear, oneExecute };
}

export default useTimeout;