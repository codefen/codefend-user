import { toast } from 'react-toastify';
import { useAuthState } from '.';
import {
	type CompanyResourcesID,
	OrderFrequency,
	type OrderStore,
	OrderTeamSize,
	ScopeOption,
	useOrderStore,
	CryptoPayment,
} from '..';
import { useRef, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useOrders = () => {
	const { getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const { setScopeAllTotalResources, updateState } = useOrderStore(
		(state) => state,
	);

	const fetchGetTotal = (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/index',
				size: 'full',
				company_id: companyID,
			},
		}).then(({ data }: any) => {
			const companyResourceIDs: CompanyResourcesID = {
				web: data.resources_web
					? data.resources_web.map(
							(resource: any) => resource.id as string,
						)
					: [],
				mobile: data.resources_mobile
					? data.resources_mobile.map(
							(resource: any) => resource.id as string,
						)
					: [],
				social: data.resources_social
					? data.resources_social.map(
							(resource: any) => resource.id as string,
						)
					: [],
				cloud: data.resources_cloud
					? data.resources_cloud.map(
							(resource: any) => resource.id as string,
						)
					: [],
				source: data.resources_source
					? data.resources_source.map(
							(resource: any) => resource.id as string,
						)
					: [],
				lan: data.resources_lan
					? data.resources_lan.map(
							(resource: any) => resource.id as string,
						)
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

		fetchGetTotal(companyID);
	};

	return { refetchTotal };
};

export const useOrderScope = () => {
	const [fetcher, _, isLoading] = useFetcher();
	const { getCompany } = useAuthState();
	const { companyResourceIDs } = useOrderStore((state) => state);

	const fetchScope = (companyID: string, resourceScope: string) => {
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

		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'scope',
				company_id: companyID,
				resources_class: resourceScope.trim(),
				resources_ids: resourcesID
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}

				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	const sendScopeOrders = (resourceScope: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchScope(companyID, resourceScope);
	};

	return { sendScopeOrders };
};

export const useOrderMembership = () => {
	const { getCompany } = useAuthState();
	const [fetcher, _] = useFetcher();

	const fetchmemberShip = (
		companyID: string,
		referenceNumber: string,
		memberShip: string,
	) => {
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'membership',
				company_id: companyID,
				reference_number: referenceNumber,
				membership: memberShip,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	const sendMemberShip = (memberShip: string, referenceNumber: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchmemberShip(companyID, referenceNumber, memberShip);
	};

	return { sendMemberShip };
};

export const useOrderPlan = () => {
	const { getCompany } = useAuthState();
	const [fetcher, _] = useFetcher();

	const fetchPlan = (
		companyID: string,
		referenceNumber: string,
		chosenPlan: string,
		chosenPrice: string,
	) => {
		fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'plan',
				company_id: companyID,
				reference_number: referenceNumber,
				chosen_plan: chosenPlan,
				chosen_plan_price: chosenPrice,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
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

		return fetchPlan(companyID, referenceNumber, chosenPlan, chosenPrice);
	};

	const getCurrentPrices = (referenceNumber: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'plan',
				company_id: companyID,
				reference_number: referenceNumber,
				show: 'prices',
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
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
	const [fetcher, _] = useFetcher();
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

	const fetchConfirm = (companyID: string, referenceNumber: string) => {
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'confirm',
				company_id: companyID,
				reference_number: referenceNumber,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}

				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	const sendConfirmOrder = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchConfirm(companyID, referenceNumber);
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
	const [fetcher, _] = useFetcher();

	const fetchProviders = (
		companyID: string,
		referenceNumber: string,
		providerID: string,
	) => {
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'providers',
				company_id: companyID,
				reference_number: referenceNumber,
				provider_class: 'user',
				provider_id: providerID,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	const sendOrderProvider = (referenceNumber: string, providerID: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchProviders(companyID, referenceNumber, providerID);
	};

	const getCurrentProviders = (referenceNumber: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'providers',
				company_id: companyID,
				reference_number: referenceNumber,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	return { sendOrderProvider, getCurrentProviders };
};

export const useOrderOffensive = () => {
	const { getCompany } = useAuthState();
	const [fetcher, _] = useFetcher();

	const fetchOffensive = (
		companyID: string,
		referenceNumber: string,
		offensiveness: string,
	) => {
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'offensiveness',
				company_id: companyID,
				reference_number: referenceNumber,
				offensiveness: offensiveness,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error(String(data.info).startsWith("Order->offensiveness can only") ? "Can only be adversary if plan is full." : 'An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => {
				toast.error(error.message);
				return {error: true}
			});
	};

	const sendOrderProvider = (
		referenceNumber: string,
		offensiveness: string,
	) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchOffensive(companyID, referenceNumber, offensiveness);
	};

	return { sendOrderProvider };
};

export const userOrderProviderInfo = () => {
	const { getCompany } = useAuthState();
	const [fetcher, _] = useFetcher();
	const fetchProviderInfo = (
		companyID: string,
		referenceNumber: string,
		providerInfo: string,
	) => {
		return fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'provider_info',
				company_id: companyID,
				reference_number: referenceNumber,
				provider_info: providerInfo,
			},
		})
			.then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	const sendOrderProviderInfo = (referenceNumber: string, info: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchProviderInfo(companyID, referenceNumber, info);
	};

	return { sendOrderProviderInfo };
};

export const userOrderFinancialResource = () => {
	const { getCompany } = useAuthState();
	const [fetcher, _] = useFetcher();
	const fetchFinancial = (
		companyID: string,
		referenceNumber: string,
		financial: string,
	) => {
		return fetcher("post", {
			body: {
				model: "orders/add",
				phase: "financial",
				company_id: companyID,
				reference_number: referenceNumber,
				financial_resource: financial
			}
		}).then(({ data }: any) => {
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				return data;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	const sendOrderFinancial = (referenceNumber: string, financial: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}

		return fetchFinancial(companyID, referenceNumber, financial);
	};

	return { sendOrderFinancial };
};

export interface OrderCryptoFinancial {
	walletID: string;
	currencyActive: CryptoPayment;
}

export const useOrderCryptoFinancial = () => {
	const [fetcher] = useFetcher();
	const { getCompany } = useAuthState();
	const [walletActive, setWallet] = useState<OrderCryptoFinancial>({ walletID: '. . .', currencyActive: CryptoPayment.BITCOIN });
	const qrCode = useRef<string>();

	const getCryptoFinancialInfo = (referenceNumber: string, crypto?: CryptoPayment) => {
		qrCode.current =undefined;
		setWallet(({walletID: "...", currencyActive: crypto || CryptoPayment.BITCOIN}));

		fetcher('post', {
			body: {
				model: 'orders/add',
				phase: 'financial_cc',
				company_id: getCompany(),
				reference_number: referenceNumber,
				cc_blockchain: crypto || "BTC",
			}
		})
			.then(({data}: any) => {
				
				if (Number(data.error) === 1) {
					throw new Error('An error has occurred with the');
				}
				setWallet({
					walletID: data.cc.cc_address,
					currencyActive: crypto || CryptoPayment.BITCOIN
				});
				qrCode.current = data.cc.cc_address_qr;
			})
			.catch((error: Error) => toast.error(error.message));
	};

	return {
		getCryptoFinancialInfo,
		walletActive,
		qrCode
	};
};


export const useOrderSaveCryptoPayment = ()=>{
	const [fetcher] = useFetcher();
	const { getCompany } = useAuthState();
	const [copied, setCopied] = useState(false);
	const [transactionID, setTransactionID] = useState('');
	const [trySend, setTrySend] = useState(false);

	const copyTextToClipboard = (cryptoAddress: string) => {
		navigator.clipboard.writeText(cryptoAddress).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const saveCryptoPayment = (referenceNumber: string, crypto: string, address: string)=>{
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetcher("post", {
			body: {
				model: 'orders/add',
				phase: 'financial_cc',
				company_id: getCompany(),
				reference_number: referenceNumber,
				cc_blockchain: crypto,
				cc_from_address: address,
				cc_xfer_id: transactionID
			}
		}).then(({data}:any)=>{
			if (Number(data.error) === 1) {
				throw new Error('An error has occurred with the');
			}
			return data;
		});
	}

	return {transactionID, trySend, copied, setTrySend, setTransactionID, copyTextToClipboard, saveCryptoPayment};
}

export const useOrderSaveBank = ()=>{
	const [fetcher] = useFetcher();
	const { getCompany } = useAuthState();
	const [transactionID, setTransactionID] = useState('');
	const saveBankPayment = (referenceNumber: string, address: string)=>{
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetcher("post", {
			body: {
				model: 'orders/add',
				phase: 'bank',
				company_id: getCompany(),
				reference_number: referenceNumber,
				bank_xfer_id: address,
			}
		}).then(({data}:any)=>{
			console.log({data})
			return data;
		});
	}

	return [transactionID, {setTransactionID, saveBankPayment}] as const;
}
export const userOrderCardPayment = ()=>{
	const [fetcher, isLoading,_] = useFetcher();
	const { getCompany } = useAuthState();
	const [cardInfo, setCardInfo] = useState({
		cardOwner: '',
		cardNumber: '',
		cardDueDate: '',
		cardDueYear: '',
		cardCVC: '',
	});


	const sendPayment = (referenceNumber: string)=>{
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetcher("post", {
			body: {
				model: 'orders/add',
				phase: 'card',
				company_id: getCompany(),
				reference_number: referenceNumber,
			}
		}).then(({data}:any)=>{
			console.log({data});
			return data;
		});
	}

	return [cardInfo, {setCardInfo, sendPayment, isLoading}] as const;
}

export const userOrderFnished = ()=>{
	const [fetcher] = useFetcher();
	const { getCompany } = useAuthState();
	const finishOrder = (referenceNumber: string)=>{
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetcher("post", {
			body: {
				model: 'orders/add',
				phase: 'finished',
				company_id: getCompany(),
				reference_number: referenceNumber,
			}
		}).then(({data}:any)=>{
			console.log({data});
			return data;
		});
	}

	return finishOrder;
}
