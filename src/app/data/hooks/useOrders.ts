import { toast } from 'react-toastify';
import { useAuthState } from '.';
import { OrderService } from '../services/order.service';
import {
	type CompanyResourcesID,
	OrderFrequency,
	type OrderStore,
	OrderTeamSize,
	ScopeOption,
	useOrderStore,
} from '..';
import { useRef, useState } from 'react';
import { useFetcher } from './util/useFetcher';

export const useOrders = () => {
	const { getCompany } = useAuthState();
	const { setScopeAllTotalResources, updateState } = useOrderStore(
		(state) => state,
	);

	const fetcher = (companyID: string) => {
		OrderService.getTotalResourceCount(companyID).then((res: any) => {
			const companyResourceIDs: CompanyResourcesID = {
				web: res.resources_web
					? res.resources_web.map((resource: any) => resource.id as string)
					: [],
				mobile: res.resources_mobile
					? res.resources_mobile.map(
							(resource: any) => resource.id as string,
						)
					: [],
				social: res.resources_social
					? res.resources_social.map(
							(resource: any) => resource.id as string,
						)
					: [],
				cloud: res.resources_cloud
					? res.resources_cloud.map(
							(resource: any) => resource.id as string,
						)
					: [],
				source: res.resources_source
					? res.resources_source.map(
							(resource: any) => resource.id as string,
						)
					: [],
				lan: res.resources_lan
					? res.resources_lan.map((resource: any) => resource.id as string)
					: [],
			};

			const countAllTotalResource =
				companyResourceIDs.web.length +
				companyResourceIDs.mobile.length +
				companyResourceIDs.social.length +
				companyResourceIDs.cloud.length +
				companyResourceIDs.source.length +
				companyResourceIDs.lan.length;

			setScopeAllTotalResources(countAllTotalResource);
			updateState('companyResourceIDs', companyResourceIDs);
		});
	};

	const refetchTotal = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		fetcher(companyID);
	};

	return { refetchTotal };
};

export const useOrderScope = () => {
	const { getCompany } = useAuthState();
	const { companyResourceIDs } = useOrderStore((state) => state);

	const fetcher = (companyID: string, resourceScope: string) => {
		let resourcesID: string = '';

		if (resourceScope === 'full') {
			for (const key in companyResourceIDs) {
				if (companyResourceIDs.hasOwnProperty(key)) {
					const ids =
						companyResourceIDs[
							key as keyof typeof companyResourceIDs
						].join(',');
					resourcesID += `${key}:${ids};`;
				}
			}
		} else if (resourceScope === 'web') {
			resourcesID = `web:${companyResourceIDs.web.join(',')};`;
		} else if (resourceScope === 'mobile') {
			resourcesID = `mobile:${companyResourceIDs.mobile.join(',')};`;
		} else if (resourceScope === 'cloud') {
			resourcesID = `cloud:${companyResourceIDs.cloud.join(',')};`;
		} else if (resourceScope === 'source') {
			resourcesID = `social:${companyResourceIDs.social.join(',')};`;
		} else if (resourceScope === 'social') {
			resourcesID = `source:${companyResourceIDs.source.join(',')};`;
		} else if (resourceScope === 'lan') {
			resourcesID = `lan:${companyResourceIDs.lan.join(',')};`;
		}

		return OrderService.sendOrderScope(
			companyID,
			resourceScope.trim(),
			resourcesID,
		).then((res: any) => {
			return res;
		});
	};

	const sendScopeOrders = (resourceScope: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, resourceScope);
	};

	return { sendScopeOrders };
};

export const useOrderMembership = () => {
	const { getCompany } = useAuthState();

	const fetcher = (
		companyID: string,
		referenceNumber: string,
		memberShip: string,
	) => {
		return OrderService.sendMemberShip(
			companyID,
			referenceNumber,
			memberShip,
		).then((res: any) => {
			return res;
		});
	};

	const sendMemberShip = (memberShip: string, referenceNumber: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber, memberShip);
	};

	return { sendMemberShip };
};

export const useOrderPlan = () => {
	const { getCompany } = useAuthState();

	const fetcher = (
		companyID: string,
		referenceNumber: string,
		chosenPlan: string,
		chosenPrice: string,
	) => {
		return OrderService.sendOrderPlan(
			companyID,
			referenceNumber,
			chosenPrice,
			chosenPlan,
		).then((res: any) => {
			return res;
		});
	};

	const sendPlanTeamSize = (
		chosenPlan: string,
		chosenPrice: string,
		referenceNumber: string,
	) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber, chosenPlan, chosenPrice);
	};

	const getCurrentPrices = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return OrderService.getCurrentPrices(companyID).then((res: any) => res);
	};

	return { sendPlanTeamSize, getCurrentPrices };
};

export const useOrderConfirm = () => {
	const { getCompany } = useAuthState();
	const {
		resourceType,
		scope,
		frequency,
		teamSize,
		updateState,
		referenceNumber,
	} = useOrderStore((state: OrderStore) => state);

	const resourcesText =
		scope.scopeOption === ScopeOption.ALL
			? 'All company '
			: `Only ${resourceType.valueOf()} `;

	const frequencyTitle =
		frequency === OrderFrequency.ONCE
			? 'One unique scan:'
			: 'Permanent surveillance:';

	const frequencyText =
		frequency === OrderFrequency.ONCE
			? `Codefend will perform a 4 weeks IT secuirty assessment on the selected scope, one report, no subscription.`
			: `Codefend will perform out a maximum of 12 IT secuirty assessment per year.`;

	let teamSizeText = '';
	if (teamSize === OrderTeamSize.SMALL) teamSizeText = 'Small team';
	if (teamSize === OrderTeamSize.MID) teamSizeText = 'Medium team';
	if (teamSize === OrderTeamSize.FULL) teamSizeText = 'Full team';

	const fetcher = (companyID: string, referenceNumber: string) => {
		return OrderService.sendOrderConfirm(companyID, referenceNumber).then(
			(res: any) => {
				return res;
			},
		);
	};

	const sendConfirmOrder = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber);
	};

	return {
		sendConfirmOrder,
		teamSizeText,
		frequencyText,
		frequencyTitle,
		resourcesText,
		updateState,
	};
};

export const useOrderProvider = () => {
	const { getCompany } = useAuthState();

	const fetcher = (companyID: string, referenceNumber: string, providerID:string) => {
		return OrderService.sendOrderProvider(companyID, referenceNumber, providerID).then(
			(res: any) => res
		);
	};

	const sendOrderProvider = (referenceNumber: string, providerID: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber, providerID);
	};

	const getCurrentProviders = (referenceNumber: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return OrderService.getCurrentProviders(companyID, referenceNumber).then(
			(res: any) => res,
		);
	};

	return { sendOrderProvider, getCurrentProviders };
};


export const useOrderOffensive = () => {
	const { getCompany } = useAuthState();

	const fetcher = (companyID: string, referenceNumber: string, offensiveness:string) => {
		return OrderService.sendOrderOffensive(companyID, referenceNumber, offensiveness).then(
			(res: any) => res
		);
	};

	const sendOrderProvider = (referenceNumber: string, offensiveness: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber, offensiveness);
	};

	return { sendOrderProvider };
};

export const userOrderProviderInfo = () => {
	const { getCompany } = useAuthState();

	const fetcher = (companyID: string, referenceNumber: string, info:string) => {
		return OrderService.sendOrderProviderInfo(companyID, referenceNumber, info).then(
			(res: any) => res
		);
	};

	const sendOrderProviderInfo = (referenceNumber: string, info: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber, info);
	};

	return { sendOrderProviderInfo };
};

export const userOrderFinancialResource = () => {
	const { getCompany } = useAuthState();

	const fetcher = (companyID: string, referenceNumber: string, financial: string) => {
		return OrderService.sendOrderFinancial(companyID, referenceNumber, financial).then(
			(res: any) => res
		);
	};

	const sendOrderFinancial = (referenceNumber: string, financial: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher(companyID, referenceNumber, financial);
	};

	return { sendOrderFinancial };
};

export interface OrderCryptoFinancial {
	walletID: string;
	qrCode: string;
}

export const useOrderCryptoFinancial = ()=>{
	const [fetcher] = useFetcher();
	const { getCompany } = useAuthState();
	const cryptoBtc = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});
	const cryptoEth = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});
	const cryptoLtc = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});
	const cryptoMonero = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});
	const cryptoSol = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});
	const cryptoUsdT = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});
	const cryptoUsdC = useRef<OrderCryptoFinancial>({walletID: "", qrCode: ""});

	const getCryptoFinancialInfo = (referenceNumber: string, crypto: string)=> {
		fetcher("post", {
			body: {
				model: "orders/add",
				phase: "financial",
				company_id: getCompany(),
				reference_number: referenceNumber,
				financial_resource: crypto
			}
		}).then((res)=>{
			console.log({ res });
		});
	}

	return { getCryptoFinancialInfo, cryptoEth, cryptoBtc, cryptoLtc, cryptoMonero, cryptoSol, cryptoUsdT, cryptoUsdC };
}

/*
export const useOrderCryptoSave = (cryptoAddress: string)=>{
	const [copied, setCopied] = useState(false);
	const [transactionID, setTransactionID] = useState('');
	const [cryptoAddress, setC] = useState('');
	const [trySend, setTrySend] = useState(false);

	const copyTextToClipboard = () => {
		navigator.clipboard.writeText(cryptoAddress).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};
}*/