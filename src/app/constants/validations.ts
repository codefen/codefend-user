import { toast } from "react-toastify";

/* 
    VALIDACIONES GENERALES / TRANSVERSALES
*/
//Cuando la api falla suele enviar "error" con valor 1 o "response" con el valor de "error"
export const apiErrorValidation = (error?: any, response?: any)=> error == "1" || response === "error";

export const companyIdIsNotNull = (companyID?:any)=>{
    if (!companyID) {
        toast.error('User information was not found');
        return true;
    }
    return false;
}

export const verifySession = (res: any, logout: any) => {
	if (res.response === 'error' && String(res.info).startsWith('invalid or expired')) {
			toast.error('Your session has expired');
			logout();
			return true;
	}
	return false;
};

/* 
 PATTERN REGEXS
*/
export const emailRegexVal = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/;

export const phoneNumberRegexVal = /^\+?((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){2,13}\d$/;

/*
ESTAS VALIDACIONES SOLO VALIDAN SI EL TEXTO NO ESTA VACIO
*/
export const phoneNumberValidation = (phone?:string)=> phone?.trim() !== "" && !phoneNumberRegexVal.test(phone || "");
export const nameValidation = (name?:string)=> name && name?.trim() !== "" && name.length > 100;

export const androidUriValidation = (address:string)=> address.trim() !== "" && !address.startsWith("https://play.google.com");
export const iosUriValidation = (address:string)=> address.trim() !== "" && !address.startsWith("https://apps.apple.com");

/*
ESTAS VALIDACIONES VALIDAN DATOS QUE NO DEBEN ESTAR VACIAS
*/
export const isNotEmpty = (data?:string)=> data && data?.trim() !== "";