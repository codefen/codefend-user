import { useFetcher } from "#commonHooks/useFetcher";
import { apiErrorValidation } from "@/app/constants/validations";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const useSignupInvitation = ()=>{
    const [fetcher,_, isLoading] = useFetcher();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        invokeEmail: '',
        invokeHash: "",
        name: "",
        lastname: "",
        username: "",
        role: "",
        idiom: "",
        phone: "",
        password: ""
    })

    const sendSignUp = ()=>{
        fetcher("post", {
            body: {
                model: "users/invoke/finish",
                invoke_user_email: form.invokeEmail,
                invoke_user_hash: form.invokeHash,
                user_fname: form.name,
                user_lname: form.lastname,
                user_username: form.username,
                user_role: form.role,
                user_phone: form.phone,
                user_password: form.password,
                user_idiom: form.idiom
            }
        }).then(({data}:any)=>{
            if (data.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error('An error has occurred on the server');
			}
            navigate("/auth/signin");
            setForm({
                invokeEmail: '',
                invokeHash: "",
                name: "",
                lastname: "",
                username: "",
                role: "",
                phone: "",
                password: "",
                idiom: ""
            });
            toast.success("Now you're registered! You can log in");
        }).catch(()=>{
            toast.error("A server crash has occurred and we have not been able to register you");
        });
    }

    return {form, setForm, sendSignUp, isLoading};
}