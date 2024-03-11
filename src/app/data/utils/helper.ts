import DOMPurify from 'isomorphic-dompurify';
import { toast } from 'react-toastify';

/** Gets token in localStorage */
export const getToken = () => {
	const storeJson = localStorage.getItem('authStore') ?? '';
	const store = storeJson !== undefined ? JSON.parse(storeJson) : {};
	return store ? store.state.accessToken  : "";
};
/** Gets company id in localStorage */
export const getFullCompanyFromUser = () => {
	const storeJson = localStorage.getItem('authStore') ?? '';
	const store = storeJson !== undefined ? JSON.parse(storeJson) : {};
	const companyID = store ? store.state.userData.companyID  : "";
	return {
		id: String(companyID),
		name: "codefend",
		web: "",
		size: "",
		pais_code: "",
		pais: "",
		pais_provincia: "",
		pais_ciudad: "",
		owner_fname: "",
		owner_lname: "",
		owner_role: "",
		owner_email: "",
		owner_phone: "",
		orders_size: "",
		profile_media: "",
		mercado: "",
		isDisabled: false,
		createdAt: ""
	};
};

/** GET base api url in localStorage */
export const getCustomBaseAPi = () =>
	window.localStorage.getItem('baseApi') ?? '';

/** SET baseApi in localStorage */
export const setCustomBaseAPi = (baseApi: string) =>
	window.localStorage.setItem('baseApi', baseApi);

/** delete custom base APi */
export const deleteCustomBaseAPi = () =>
	window.localStorage.removeItem('baseApi');

export const RUNNING_DESKTOP = (): boolean => {
	return window.__TAURI__ !== undefined;
};

/** Date formatter */
export const formatDate = (stringDate: string): string => {
	const date = new Date(stringDate);

	const year = date.getFullYear();
	const month = extractDateItem(date.getMonth() + 1 );
    const day = extractDateItem(date.getDate());

	return `${year}-${month}-${day}`;
};

/** check if  data is empty/zeros */
export const isEmptyData = (data: any) => {
	if (data.constructor !== Object) return true;

	return Object.values(data).every(
		(item) => Boolean(item) == false || item == 0,
	);
};

/* Random UUID generator function  */
export const generateID = () => crypto.randomUUID();

/**
 * Function generating a random "N" UUID array
 * @returns {Array<string>} - Un array de de ID.
 */
export const generateIDArray = (N: number): string[] => {
	return Array.from({ length: N }, () => {
		return generateID();
	});
};
/**
 * Clear a string of characters: "opiniones", "&nbsp;", "&Acirc;", "reseñas"
 * Used to clean reviews
 */
export const cleanReview = (source: string): string => {
	let update = source.replace(/\bopiniones\b/gi, '');
	update = update.replace(/&nbsp;/g, '');
	update = update.replace(/&Acirc;/g, '');
	update = update.replace(/&plusmn;/g, '');
	update = update.replace(/&Atilde;/g, '');
	update = update.replace("reseas", '');

	return update.trim();
};

/**
 * Compare the equality of two objects
 * @param first 
 * @param second 
 */
export const equalsObj = (first: any, second: any): boolean =>{
	const bothAreNull = !first || !second;
	if(bothAreNull){
		return false;
	}
	const noneIsAnObject = typeof first !== 'object' || typeof second !== 'object';
	if (noneIsAnObject) {
		return false;
	}
	const firstKeys = Object.keys(first);
  	const secondKeys = Object.keys(second);

	const propertyAreNotSame = firstKeys.length !== secondKeys.length;
	if(propertyAreNotSame) return false;

	for (const key of firstKeys) {
		
		if (!equalsValues(first[key], second[key])) {
		  return false;
		}
	}

	return true;
};

/**
 * Compare the equality of two values
 * @param first 
 * @param second 
 */
export const equalsValues = (first: any, second: any)=>{
	return first === second;
};

/**
 * Maps a date in epoch format to "yyyy-mm-dd"
 * @param epochDate 
 */
export const mapEpochToDate = (epochDate: number | string): string =>{
	const date = new Date(Number(epochDate) * 1000); 

	const year = date.getFullYear();
	// Add a 0 at the beginning if the month is less than 10
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 

	//Add a 0 at the beginning if the day is less than 10
    const day = ('0' + date.getDate()).slice(-2); 
    return `${year}-${month}-${day}`;
}

export const formatDateTimeFormat = (originalDate: string): string =>{
	const date = new Date(originalDate);
    
    // Extract date and time components
    const year = date.getFullYear();
    const month = extractDateItem(date.getMonth() + 1 );
    const day = extractDateItem(date.getDate());
    const hours = extractDateItem(date.getHours());
    const minutes = extractDateItem(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const extractDateItem = (item: any) => String(item).padStart(2, '0');

export const calculateRowSize = (sizeY: number | string) => {
    return typeof sizeY === 'number' ? sizeY + 'dvh' : sizeY;
};

export const calculateRowSizeX = (sizeX: number) => {
    return `${sizeX}%`;
};

export const calculateRowCalcX = (sizeX: number) => {
    return sizeX < 100 ? `calc(100% - ${sizeX}% - 3px)` : '0%';
};

export const cleanHTML = (html: any) => {
    return DOMPurify.sanitize(html, {SAFE_FOR_TEMPLATES: true});
};

export const verifySession = (res: any, logout: any)=> {
	if(res.response === "error"){
		if(String(res.message).startsWith("invalid or expired")) {
			toast.error('Your session has expired');
			logout();
		}
	}
}