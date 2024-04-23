import { useFetcher } from "#commonHooks/useFetcher";
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
                user_password: form.password
            }
        }).then(({data}:any)=>{
            if (data.error != "0") throw new Error();
            navigate("/auth/signin");
            setForm({
                invokeEmail: '',
                invokeHash: "",
                name: "",
                lastname: "",
                username: "",
                role: "",
                phone: "",
                password: ""
            });
            toast.success("Now you're registered! You can log in");
        }).catch(()=>{
            toast.error("A server crash has occurred and we have not been able to register you");
        });
    }

    return {form, setForm, sendSignUp, isLoading};
}