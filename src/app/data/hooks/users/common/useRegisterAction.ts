import type { RegisterParams } from "@interfaces/auth";
import useAuthStore from "@stores/auth.store";
import { toast } from "react-toastify";

export const useRegisterAction = ()=>{
    const { register, registerFinish } = useAuthStore((state) => state);

    const signUpUser = async (params: RegisterParams): Promise<boolean> => {
		return register(params)
			.then((res: any) => {
				if (res.error === "1" || res.email_error == "1") {
					if(res.error === "1") toast.error('An unexpected error has occurred on the server');
					if(res.email_error === "1") toast.error(res.email_info);
					return false;
				} 
				toast.success(`Signup phase one successful`);
				return true;
			})
			.catch((error: Error) => {
				toast.error(
					error.message && error.message !== undefined
						? error.message
						: 'An unexpected error has occurred on the server',
				);
				return false;
			});
	};

    const signUpFinish = async (params: any): Promise<boolean> => {
		return registerFinish(params)
			.then((res: any) => {
				console.log({res})
				if (res.response === "error" || res.error == true || res.error == "1") throw new Error(res.info || "");

				toast.success(
					"Now you're registered! You can log in"
				);
				
				return true;
			})
			.catch((e: Error) => {
				if(e.message.startsWith("Invalid")) {
					toast.error("Invalid email or username");
				} else {
					toast.error(
						'An unexpected error has occurred on the server'
					);
				}
				return false;
			});
	};

    return { signUpUser, signUpFinish };
}