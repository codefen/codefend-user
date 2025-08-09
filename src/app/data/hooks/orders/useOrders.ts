import { toast } from 'react-toastify';
import { useRef, useState, useCallback } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import type { SocialResourceResume } from '@interfaces/resources-resumes';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { ORDER_PHASES_TEXT } from '@/app/constants/app-toast-texts';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useOrderStore, type OrderStore } from '@stores/orders.store';
import {
  CryptoPayment,
  OrderFrequency,
  OrderTeamSize,
  ResourcesTypes,
  ScopeOption,
  UserPlanSelected,
  type ResumeAllResources,
} from '@interfaces/order';
import { getMappedDomainCount } from '@utils/helper';

export const useOrders = () => {
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();
  const { setScopeAllTotalResources, updateState, setScopeTotalResources, resourceType } =
    useOrderStore(state => state);
  const path =
    resourceType === ResourcesTypes.SOCIAL
      ? 'se'
      : resourceType === ResourcesTypes.NETWORK
        ? 'lan'
        : resourceType;

  const fetchGetTotal = (companyID: string) => {
    fetcher('post', {
      body: {
        model: `resources/${path}/index`,
        size: 'full',
        childs: 'yes',
        company_id: companyID,
      },
    }).then(({ data }: any) => {
      const resumeResources: ResumeAllResources = {
        web:
          resourceType === ResourcesTypes.WEB
            ? data?.resources?.map?.((resource: any) => ({
                id: resource.id,
                resource_domain: resource.resource_domain,
                server: resource.main_server,
                childs: resource.childs
                  ? resource.childs.map((childRes: any) => ({
                      id: childRes.id,
                      resource_domain: childRes.resource_domain,
                      server: childRes.main_server,
                    }))
                  : [],
              }))
            : [],
        mobile:
          resourceType === ResourcesTypes.MOBILE
            ? data?.disponibles?.map?.((resource: any) => ({
                id: resource.id,
                app_name: resource.app_name,
                app_link: resource.app_link,
              }))
            : [],
        social:
          resourceType === ResourcesTypes.SOCIAL
            ? ({
                social_resources: getMappedDomainCount(data?.emails_domains),
              } as SocialResourceResume)
            : ({ social_resources: [] } as SocialResourceResume),
        cloud: data?.resources_cloud
          ? data?.resources_cloud?.map?.((resource: any) => ({
              id: resource.id,
              cloud_name: resource.cloud_name,
              cloud_provider: resource.cloud_provider,
            }))
          : [],
        source:
          resourceType === ResourcesTypes.CODE
            ? data?.resources_source?.map?.((resource: any) => ({
                id: resource.id,
                name: resource.name,
                access_link: resource.access_link,
              }))
            : [],
        network:
          resourceType === ResourcesTypes.NETWORK
            ? data?.disponibles?.map?.((resource: any) => ({
                id: resource.id,
                device_ex_address: resource.device_ex_address,
                device_in_address: resource.device_in_address,
                childs: resource.childs
                  ? resource.childs?.map?.((childRes: any) => ({
                      id: childRes.id,
                      device_ex_address: childRes.device_ex_address,
                      device_in_address: childRes.device_in_address,
                    }))
                  : [],
              }))
            : [],
      };
      const resourcesLength = {
        [ResourcesTypes.WEB]: resumeResources.web.length,
        [ResourcesTypes.MOBILE]: resumeResources.mobile.length,
        [ResourcesTypes.CLOUD]: resumeResources.cloud.length,
        [ResourcesTypes.CODE]: resumeResources.source.length,
        [ResourcesTypes.NETWORK]: resumeResources.network.length,
        [ResourcesTypes.SOCIAL]: resumeResources.social.social_resources.length,
        [ResourcesTypes.LEAKS]: 0,
      };
      const countAllTotalResource = Object.values(resourcesLength).reduce(
        (acc, val) => acc + val,
        0
      );

      updateState('resumeResources', resumeResources);
      setScopeAllTotalResources(countAllTotalResource);
      setScopeTotalResources(resourcesLength[resourceType]);
    });
  };

  const refetchTotal = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    fetchGetTotal(companyID);
  };

  return { refetchTotal };
};

export const useOrderScope = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const { resumeResources, updateState } = useOrderStore(state => state);

  const fetchScope = (companyID: string, resourceScope: string, appId?: string) => {
    let resource: any = {};
    if (resourceScope === 'full') {
      resource = resumeResources;
    } else if (resourceScope === RESOURCE_CLASS.WEB) {
      resource = { web: resumeResources.web };
    } else if (resourceScope === RESOURCE_CLASS.MOBILE) {
      resource = { mobile: resumeResources.mobile.find((app: any) => app.id === appId) };
    } else if (resourceScope === RESOURCE_CLASS.CLOUD) {
      resource = { cloud: resumeResources.cloud };
    } else if (resourceScope === RESOURCE_CLASS.SOURCE) {
      resource = { source: resumeResources.source };
    } else if (resourceScope === RESOURCE_CLASS.SOCIAL) {
      resource = { social: resumeResources.social };
    } else if (resourceScope === RESOURCE_CLASS.NETWORK) {
      resource = { lan: resumeResources.network };
    }
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'scope',
        company_id: companyID,
        resources_class: resourceScope.trim(),
        resources_scope: JSON.stringify(resource),
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        updateState('orderId', data.order.id);
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendScopeOrders = (resourceScope: string, appId?: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetchScope(companyID, resourceScope, appId);
  };

  return { sendScopeOrders };
};

export const useOrderMembership = () => {
  const { getCompany } = useUserData();
  const [fetcher, _] = useFetcher();

  const fetchmemberShip = (
    companyID: string,
    referenceNumber: string,
    memberShip: string,
    orderId: string
  ) => {
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'membership',
        company_id: companyID,
        reference_number: referenceNumber,
        membership: memberShip,
        order_id: orderId,
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendMemberShip = (memberShip: string, referenceNumber: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetchmemberShip(companyID, referenceNumber, memberShip, orderId);
  };

  return { sendMemberShip };
};

export const useOrderPlan = () => {
  const { getCompany } = useUserData();
  const [fetcher, _] = useFetcher();

  const fetchPlan = (
    companyID: string,
    referenceNumber: string,
    chosenPlan: string,
    chosenPrice: string,
    orderId: string
  ) => {
    fetcher('post', {
      body: {
        phase: 'plan',
        company_id: companyID,
        reference_number: referenceNumber,
        chosen_plan: chosenPlan,
        chosen_plan_price: chosenPrice,
        order_id: orderId,
      },
      path: 'orders/add',
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendPlanTeamSize = (
    chosenPlan: string,
    chosenPrice: string,
    referenceNumber: string,
    orderId: string
  ) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetchPlan(companyID, referenceNumber, chosenPlan, chosenPrice, orderId);
  };

  const getCurrentPrices = (referenceNumber: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);

    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'plan',
        company_id: companyID,
        reference_number: referenceNumber,
        order_id: orderId,
        show: 'prices',
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  return { sendPlanTeamSize, getCurrentPrices };
};

export const useOrderConfirm = () => {
  const { getCompany } = useUserData();
  const { resourceType, scope, frequency, teamSize, updateState, referenceNumber, orderId } =
    useOrderStore((state: OrderStore) => state);
  const [fetcher, _] = useFetcher();
  const resourcesText =
    scope.scopeOption === ScopeOption.ALL ? 'All company ' : `Only ${resourceType.valueOf()} `;

  const frequencyTitle =
    frequency === OrderFrequency.ONCE ? 'One unique scan:' : 'Permanent surveillance:';

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
        order_id: orderId,
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }

        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendConfirmOrder = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
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
  const { getCompany } = useUserData();
  const [fetcher, _] = useFetcher();

  const fetchProviders = (
    companyID: string,
    referenceNumber: string,
    providerID: string,
    orderId: string
  ) => {
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'providers',
        company_id: companyID,
        reference_number: referenceNumber,
        provider_class: 'user',
        provider_id: providerID,
        order_id: orderId,
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendOrderProvider = (referenceNumber: string, providerID: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetchProviders(companyID, referenceNumber, providerID, orderId);
  };

  const getCurrentProviders = (referenceNumber: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'providers',
        company_id: companyID,
        reference_number: referenceNumber,
        order_id: orderId,
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  return { sendOrderProvider, getCurrentProviders };
};

export const useOrderOffensive = () => {
  const { getCompany } = useUserData();
  const [fetcher, _] = useFetcher();

  const fetchOffensive = (
    companyID: string,
    referenceNumber: string,
    offensiveness: string,
    orderId: string
  ) => {
    return fetcher('post', {
      body: {
        phase: 'offensiveness',
        company_id: companyID,
        reference_number: referenceNumber,
        offensiveness: offensiveness,
        order_id: orderId,
      },
      path: 'orders/add',
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(
            String(data.info).startsWith('Order->offensiveness can only')
              ? ORDER_PHASES_TEXT.FULL_FOR_ADVERSARY
              : ORDER_PHASES_TEXT.ORDER_NEST_ERROR
          );
        }
        return data;
      })
      .catch((error: Error) => {
        toast.error(error.message);
        return { error: true };
      });
  };

  const sendOrderProvider = (referenceNumber: string, offensiveness: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);

    return fetchOffensive(companyID, referenceNumber, offensiveness, orderId);
  };

  return { sendOrderProvider };
};

export const userOrderProviderInfo = () => {
  const { getCompany } = useUserData();
  const [fetcher, _] = useFetcher();
  const fetchProviderInfo = (
    companyID: string,
    referenceNumber: string,
    providerInfo: string,
    orderId: string
  ) => {
    return fetcher('post', {
      body: {
        phase: 'provider_info',
        company_id: companyID,
        reference_number: referenceNumber,
        provider_info: providerInfo,
        order_id: orderId,
      },
      path: 'orders/add',
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendOrderProviderInfo = (referenceNumber: string, info: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetchProviderInfo(companyID, referenceNumber, info, orderId);
  };

  return { sendOrderProviderInfo };
};

export const userOrderFinancialResource = () => {
  const { getCompany } = useUserData();
  const [fetcher, _] = useFetcher();
  const fetchFinancial = (
    companyID: string,
    referenceNumber: string,
    financial: string,
    orderId: string
  ) => {
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'financial',
        company_id: companyID,
        reference_number: referenceNumber,
        financial_resource: financial,
        order_id: orderId,
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        return data;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const sendOrderFinancial = (referenceNumber: string, financial: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetchFinancial(companyID, referenceNumber, financial, orderId);
  };

  return { sendOrderFinancial };
};

export interface OrderCryptoFinancial {
  walletID: string;
  currencyActive: CryptoPayment;
}

export const useOrderCryptoFinancial = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [walletActive, setWallet] = useState<OrderCryptoFinancial>({
    walletID: '. . .',
    currencyActive: CryptoPayment.BITCOIN,
  });
  const qrCode = useRef<string>('');

  const getCryptoFinancialInfo = (
    referenceNumber: string,
    crypto?: CryptoPayment,
    orderId?: string
  ) => {
    qrCode.current = '';
    setWallet({
      walletID: '...',
      currencyActive: crypto || CryptoPayment.BITCOIN,
    });

    fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'financial_cc',
        company_id: getCompany(),
        reference_number: referenceNumber,
        cc_blockchain: crypto || 'BTC',
        order_id: orderId,
      },
    })
      .then(({ data }: any) => {
        if (Number(data.error) === 1) {
          throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
        }
        setWallet({
          walletID: data.cc.cc_address,
          currencyActive: crypto || CryptoPayment.BITCOIN,
        });
        qrCode.current = data.cc.cc_address_qr;
      })
      .catch((error: Error) => toast.error(error.message));
  };

  return {
    getCryptoFinancialInfo,
    walletActive,
    qrCode,
  };
};

export const useOrderSaveCryptoPayment = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [copied, setCopied] = useState(false);
  const [transactionID, setTransactionID] = useState('');
  const [trySend, setTrySend] = useState(false);

  const copyTextToClipboard = (cryptoAddress: string) => {
    navigator.clipboard.writeText(cryptoAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveCryptoPayment = (
    referenceNumber: string,
    crypto: string,
    address: string,
    orderId: string
  ) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'financial_cc',
        company_id: getCompany(),
        reference_number: referenceNumber,
        cc_blockchain: crypto,
        cc_from_address: address,
        cc_xfer_id: transactionID,
        order_id: orderId,
      },
    }).then(({ data }: any) => {
      if (Number(data.error) === 1) {
        throw new Error(ORDER_PHASES_TEXT.ORDER_NEST_ERROR);
      }
      return data;
    });
  };

  return {
    transactionID,
    trySend,
    copied,
    setTrySend,
    setTransactionID,
    copyTextToClipboard,
    saveCryptoPayment,
  };
};

export const useOrderSaveBank = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [transactionID, setTransactionID] = useState('');
  const saveBankPayment = (referenceNumber: string, address: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'bank',
        company_id: getCompany(),
        reference_number: referenceNumber,
        bank_xfer_id: address,
        order_id: orderId,
      },
    }).then(({ data }: any) => {
      return data;
    });
  };

  return [transactionID, { setTransactionID, saveBankPayment }] as const;
};
export const userOrderCardPayment = () => {
  const [fetcher, isLoading, _] = useFetcher();
  const { getCompany } = useUserData();
  const [cardInfo, setCardInfo] = useState({
    cardOwner: '',
    cardNumber: '',
    cardDueDate: '',
    cardDueYear: '',
    cardCVC: '',
  });

  const sendPayment = (referenceNumber: string, orderId: string) => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return Promise.resolve(false);
    return fetcher('post', {
      body: {
        model: 'orders/add',
        phase: 'card',
        company_id: getCompany(),
        reference_number: referenceNumber,
        order_id: orderId,
      },
    }).then(({ data }: any) => {
      return data;
    });
  };

  return [cardInfo, { setCardInfo, sendPayment, isLoading }] as const;
};

export const userOrderFinished = () => {
  const [fetcher] = useFetcher();
  const company = useGlobalFastField('company');

  const finishOrder = useCallback(
    (
      referenceNumber: string,
      orderId: string,
      paywallSelected: UserPlanSelected = UserPlanSelected.MANUAL_PENTEST
    ) => {
      const companyID = company.get?.id;
      if (companyIdIsNull(companyID)) return Promise.resolve(false);
      return fetcher('post', {
        body: {
          phase: 'finished',
          company_id: companyID,
          reference_number: referenceNumber,
          order_id: orderId,
        },
        path: `orders/add${paywallSelected === UserPlanSelected.AUTOMATED_PLAN ? '/small' : ''}`,
      }).then(({ data }: any) => {
        if (data?.company) company.set(data.company);
        return data;
      });
    },
    [company.get?.id]
  );

  return finishOrder;
};
