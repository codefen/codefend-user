import { useAuthState } from "#commonHooks/useAuthState";
import { useFetcher } from "#commonHooks/useFetcher";
import { useRef } from "react";

export const useProviderOrders = ()=>{
    const { getCompany,getUserdata } = useAuthState();
    const [fetcher,_, isLoading] = useFetcher();
    const orders = useRef<any[]>([]);

    const getProviderOrders =  ()=>{
        fetcher("post", {
            body: {
                model: "providers/orders",
                company_id: getCompany(),
                user_id: getUserdata()?.id
            }
        }).then(({data}:any)=>{
            console.log({data});
            orders.current = [
                {
                    id: 1,
                    offensive: "adversary",
                    distributor: "Al bilad",
                    provider: "eddkrauser",
                    scope: 1,
                    sizeOrder: "full",
                    type: "all",
                    price: "13.500",
                },
                {
                    id: 2,
                    offensive: "offensive",
                    distributor: "Al bilad",
                    provider: "eddkrauser",
                    scope: 1,
                    sizeOrder: "medium",
                    type: "web",
                    price: "7.500",
                },
                {
                    id: 3,
                    offensive: "careful",
                    distributor: "Al bilad",
                    provider: "eddkrauser",
                    scope: 1,
                    sizeOrder: "small",
                    type: "mobile",
                    price: "1.500",
                }
            ];
        });
    }

    return [orders, {getProviderOrders, isLoading}] as const;
};