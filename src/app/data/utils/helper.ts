import { User } from '..';

/** Gets token in localStorage */
export const getToken = () => localStorage.getItem('token') ?? '';

/** Set token in localStorage */
export const setToken = (token: string) =>
	window.localStorage.setItem('token', token);

/** persist user data in localStorage */
export const persistUser = (userData: User) =>
	window.localStorage.setItem('user', JSON.stringify(userData));

/** GET base api url in localStorage */
export const getCustomBaseAPi = () =>
	window.localStorage.getItem('baseApi') ?? '';

/** SET baseApi in localStorage */
export const setCustomBaseAPi = (baseApi: string) =>
	window.localStorage.setItem('baseApi', baseApi);

/** delete custom base APi */
export const deleteCustomBaseAPi = () =>
	window.localStorage.removeItem('baseApi');

/** persist user data in localStorage */
export const getUser = (): User | null => {
	const userData = window.localStorage.getItem('user');
	if (userData !== null) return JSON.parse(userData);
	return userData;
};

/** set token and user data for Auth */
export const setAuth = (token: string, user: User) => {
	if (!(token && user)) return;
	setToken(token);
	persistUser(user);
};

/** clear token and user data for Auth */
export const clearAuth = () => {
	window.localStorage.removeItem('token');
	window.localStorage.removeItem('user');
};

export const RUNNING_DESKTOP = (): boolean => {
	return window.__TAURI__ !== undefined;
};

/** Date formatter */
export const formatDate = (stringDate: string): string => {
	const date = new Date(stringDate);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

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
 * Clear a string of characters: "opiniones", "&nbsp;", "&Acirc;"
 * Used to clean reviews
 */
export const cleanReview = (source: string) => {
	let update = source.replace(/\bopiniones\b/gi, '');
	update = update.replace(/&nbsp;/g, '');
	update = update.replace(/&Acirc;/g, '');
	return update.trim();
};
