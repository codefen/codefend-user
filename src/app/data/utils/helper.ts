import DOMPurify from 'isomorphic-dompurify';
import { toast } from 'react-toastify';
import { Sort, type Resouce, type Webresources } from '..';

/** Gets token in localStorage */
export const getToken = () => {
	const storeJson = localStorage.getItem('authStore') ?? '';
	const store = storeJson ? JSON.parse(storeJson) : {};
	return store ? store.state.accessToken : '';
};
/** Gets company id in localStorage */
export const getFullCompanyFromUser = () => {
	const storeJson = localStorage.getItem('authStore');
	const store = storeJson ? JSON.parse(storeJson) : null;
	const companyID = store ? store.state.userData.company_id : '';
	return {
		id: String(companyID),
		name: 'unknow',
		web: '',
		size: '',
		pais_code: '',
		pais: '',
		pais_provincia: '',
		pais_ciudad: '',
		owner_fname: '',
		owner_lname: '',
		owner_role: '',
		owner_email: '',
		owner_phone: '',
		orders_size: '',
		profile_media: '',
		mercado: '',
		isDisabled: false,
		createdAt: '',
	};
};

/** GET base api url in localStorage */
export const getCustomBaseAPi = () => {
		const storeJson = localStorage.getItem('authStore') ?? '';
		const store = storeJson !== undefined ? JSON.parse(storeJson) : {};
		
		return store?.state?.userData?.accessRole === "admin" ? localStorage.getItem('baseApi') || '' : "";
	};

/** SET baseApi in localStorage */
export const setCustomBaseAPi = (baseApi: string) =>
	window.localStorage.setItem('baseApi', baseApi);

/** delete custom base APi */
export const deleteCustomBaseAPi = () =>
	window.localStorage.removeItem('baseApi');

/** check if it is running on tauri on web  */
export const RUNNING_DESKTOP = (): boolean => {
	return window.__TAURI__ !== undefined;
};

/** Date formatter */
export const formatDate = (stringDate: string): string => {
	const date = new Date(stringDate);

	const year = date.getFullYear();
	const month = extractDateItem(date.getMonth() + 1);
	const day = extractDateItem(date.getDate());

	return `${year}-${month}-${day}`;
};

export const getCurrentDate = () => {
	const formattedDate = new Date();
	const month = formattedDate.getMonth() + 1;
	const day = formattedDate.getDate();
	const year = formattedDate.getFullYear();

	return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
};

export const removeSpecialCharacters = (inputString: string) => {
	const regex = /[.,;:_#?-]/g;
	return inputString.replace(regex, '');
};

/** check if  data is empty/zeros */
export const isEmptyData = (data: any) => {
	if (!data || data.constructor !== Object) return true;

	return Object.values(data).every(
		(item) => Boolean(item) == false || item == 0,
	);
};

export const isEmptyShares = (data: any) => {
	if (!data || data.constructor !== Object) return true;

	return Object.values(data).every((item) => !Boolean(item));
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
	update = update.replace('reseas', '');

	return update.trim();
};

/**
 * Compare the equality of two objects
 */
export const equalsObj = (first: any, second: any): boolean => {
	const bothAreNull = !first || !second;
	if (bothAreNull) {
		return false;
	}

	const noneIsAnObject =
		typeof first !== 'object' || typeof second !== 'object';
	if (noneIsAnObject) {
		return false;
	}

	const firstKeys = Object.keys(first);
	const secondKeys = Object.keys(second);

	const propertyAreNotSame = firstKeys.length !== secondKeys.length;
	if (propertyAreNotSame) return false;

	for (const key of firstKeys) {
		if (!equalsValues(first[key], second[key])) {
			return false;
		}
	}

	return true;
};

/**
 * Compare the equality of two values
 */
export const equalsValues = (first: any, second: any) => {
	return first === second;
};

/**
 * Maps a date in epoch format to "yyyy-mm-dd"
 * @param epochDate
 */
export const mapEpochToDate = (epochDate: number | string): string => {
	const date = new Date(Number(epochDate) * 1000);

	const year = date.getFullYear();
	// Add a 0 at the beginning if the month is less than 10
	const month = ('0' + (date.getMonth() + 1)).slice(-2);

	//Add a 0 at the beginning if the day is less than 10
	const day = ('0' + date.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
};

export const formatDateTimeFormat = (originalDate: string): string => {
	const date = new Date(originalDate);

	// Extract date and time components
	const year = date.getFullYear();
	const month = extractDateItem(date.getMonth() + 1);
	const day = extractDateItem(date.getDate());
	const hours = extractDateItem(date.getHours());
	const minutes = extractDateItem(date.getMinutes());

	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

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
	return DOMPurify.sanitize(html, { SAFE_FOR_TEMPLATES: true });
};

export const verifySession = (res: any, logout: any) => {
	if (res.response === 'error') {
		if (String(res.message).startsWith('invalid or expired')) {
			toast.error('Your session has expired');
			logout();
		}
	}
};

export const removePrintAttributesFromBody = () => {
	document.body.removeAttribute('print-report');
	document.title = 'Codefend';
};

export const addPrintAttributesFromBody = (
	resources: any,
	resourceDomainText: string,
) => {
	document.body.setAttribute('print-report', 'true');
	const createdAt = Array.isArray(resources)
		? resources?.[0]?.createdAt || ''
		: resources?.createdAt || '';

	document.title = `${formatDate(createdAt)}-${removeSpecialCharacters(resourceDomainText)}`;
};

export const formatToMonthYear = (dateString: string) => {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const date = new Date(dateString);
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${month} ${year}`;
};

export const formatKeyName = (key: any) => {
	return key
		.split('_')
		.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const processScans = (scans: any) => {
	const groupedScans = scans.reduce((acc: any, scan: any) => {
		const macAddress = scan.device_mac_address;
		if (!acc[macAddress]) {
			acc[macAddress] = [];
		}
		acc[macAddress].push(scan);
		return acc;
	}, {});

	return Object.values(groupedScans).map((scans: any) => {
		const latestScan = scans.sort((a: any, b: any) => {
			return new Date(b.creacion).getTime() - new Date(a.creacion).getTime();
		})[0];

		latestScan.additionalScans = scans.length - 1;
		return latestScan;
	});
};

export const isScanComplianceValid = (scan: any) => {
	if (!scan.report_data) {
		return false;
	}

	try {
		JSON.parse(scan.report_data);
		return true;
	} catch (err) {
		return false;
	}
};

export const processCompliance = (scan: any) => {
	if (!scan.report_data) {
		return 0;
	}

	try {
		const report = JSON.parse(scan.report_data);

		for (const key in report) {
			if (report.hasOwnProperty(key)) {
				const value = report[key];
				if (Array.isArray(value)) {
					if (value.length === 0) {
						return 0;
					}
				} else if (typeof value === 'boolean' && !value) {
					return 0;
				}
			}
		}

		return 1;
	} catch (err) {
		return 0;
	}
};

export const extractCWEID = (text: string) => {
	if (!text) {
		return 0;
	}
	var pattern = /CWE-(\d+)/;

	var match = text.match(pattern);

	if (match !== null) {
		return match[1];
	} else {
		return 'CWE ID not found.';
	}
};

export const compareVersions = (versionA: any, versionB: any) => {
	if (!versionA) return -1;
	if (!versionB) return 0;

	const partsA = versionA.split('.').map(Number);
	const partsB = versionB.split('.').map(Number);

	const maxLength = Math.max(partsA.length, partsB.length);

	for (let i = 0; i < maxLength; i++) {
		const partA = partsA[i] || 0;
		const partB = partsB[i] || 0;

		if (partA > partB) return 1;
		if (partA < partB) return -1;
	}

	return 0;
};

export const mapScoreToWord = (score: number) => {
	const mapping: { [key: number]: string } = {
		0: '?',
		1: 'intel',
		2: 'low',
		3: 'medium',
		4: 'elevated',
		5: 'critical',
	};

	return mapping[score] || '?';
};

export const highlightToBeforeAfterMatch = (title: string, appName: string) => {
	const lowerCaseTitle = title.toLowerCase();
	const lowerCaseAppName = appName.toLowerCase();

	if (!lowerCaseTitle.includes(lowerCaseAppName)) {
		return {
			before: undefined,
			match: undefined,
			after: undefined,
			title: title,
		};
	}

	const index = lowerCaseTitle.indexOf(lowerCaseAppName);

	const before = title.substring(0, index);
	const match = title.substring(index, index + appName.length);
	const after = title.substring(index + appName.length);

	return { before, match, after, title: undefined };
};

export const flattenRowsData = (rowsData: any[]) => {
	return Boolean(rowsData.length) ? [...rowsData].flatMap((data) => data) : [];
};
export const compareValues = (
	a: any,
	b: any,
	sortDirection: string,
): number => {
	if (typeof a === 'object' && typeof b === 'object') {
		a = getValueFromObject(a);
		b = getValueFromObject(b);
	}

	if (sortDirection === Sort.asc) {
		return a < b ? -1 : a > b ? 1 : 0;
	} else {
		return a > b ? -1 : a < b ? 1 : 0;
	}
};

export const getValueFromObject = (value: any): any => {
	return value.props?.riskScore || value.props?.country || value;
};

export const quickSort = (
	arr: any[],
	dataSort: string,
	sortDirection: string,
): any[] => {

	if (arr.length <= 1) {
		return arr;
	}

	const stack = [];
	let left = 0;
	let right = arr.length - 1;

	const auxArr = [...arr];

	stack.push(left, right);

	while (stack.length) {
		right = stack.pop()!;
		left = stack.pop()!;

		const pivotIndex = partition(
			auxArr,
			left,
			right,
			dataSort,
			sortDirection,
		);

		if (left < pivotIndex - 1) {
			stack.push(left, pivotIndex - 1);
		}

		if (pivotIndex + 1 < right) {
			stack.push(pivotIndex + 1, right);
		}
	}
	return auxArr;
};

const partition = (
	arr: any[],
	left: number,
	right: number,
	dataSort: string,
	sortDirection: string,
): number => {
	const pivotValue = arr[right][dataSort]?.value;
	let pivotIndex = left;

	for (let i = left; i < right; i++) {
		const aValue = arr[i][dataSort]?.value;
		if (compareValues(aValue, pivotValue, sortDirection) < 0) {
			swap(arr, i, pivotIndex);
			pivotIndex++;
		}
	}

	swap(arr, pivotIndex, right);
	return pivotIndex;
};

const swap = (arr: any[], i: number, j: number): void => {
	const temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
};

export const formatWalletID = (walletID: string)=> {
    if (typeof walletID !== 'string') {
        return '';
    }

    const firstFour = walletID.slice(0, 4);
    const lastThree = walletID.slice(-3);

    return `${firstFour}*****${lastThree}`;
}

export const findWebResourceByID = (
	getResources: Webresources[],
	id: string,
	isChild: boolean,
): Resouce | Webresources | null => {
	for (const resource of getResources) {
		if (isChild) {
			for (const child of resource.childs) {
				if (child.id === id) {
					return child;
				}
			}
		} else {
			if (resource.id === id) {
				return resource;
			}
		}
	}
	return null;
};

export const formatNumber = (price: string): string=> {
    const number = parseFloat(price);
    if (isNaN(number)) {
        throw new Error("Invalid input. Please provide a valid number as string.");
    }
    const parts = number.toString().split('').reverse().join('').match(/\d{1,3}/g);

	// Join the sections with commas
	const formattedNumber = parts?.join(',').split('').reverse().join('');

	return formattedNumber || '';
}

export const calculateDaysDifference = (targetDate: string | Date): number =>{
    const date = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const currentDate = new Date();
    const differenceInMS = date.getTime() - currentDate.getTime();
    
    // Convert the difference in milliseconds to days
    const differenceInDays = Math.ceil(differenceInMS / (1000 * 60 * 60 * 24));
    return differenceInDays;
}
export const formatReverseDate = (stringDate: string): string => {
	const date = new Date(stringDate);

	const year = date.getFullYear();
	const month = extractDateItem(date.getMonth() + 1);
	const day = extractDateItem(date.getDate());

	return `${day}-${month}-${year}`;
};
export const getDomainCounts = (members: any) => {
	const domainCounts = members.reduce((acc:any, member:any) => {
	  const [, domain] = member.member_email.split('@');
	  acc[domain] = (acc[domain] || 0) + 1;
	  return acc;
	}, {});
  
	return Object.entries(domainCounts).map(([domain, quantity]) => ({ domain, quantity }));
  };