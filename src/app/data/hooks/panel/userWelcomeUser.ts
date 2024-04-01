import { useLocalStorage } from "usehooks-ts"

export const useWelcomeUser = (initialValue: boolean)=>{
    const [openModal, setOpenModal] = useLocalStorage("openWelcomeModal", initialValue);
    const [openGuide, setOpenGuide] = useLocalStorage("openWelcomeGuide", false);


    return [openModal, openGuide, setOpenGuide, setOpenModal] as const;
}