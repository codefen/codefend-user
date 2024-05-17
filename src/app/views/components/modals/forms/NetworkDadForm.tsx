import { type FC } from 'react';

import { useAddLan } from '@resourcesHooks/netowrk/useAddLan.ts';
import { ModalTextArea } from '@defaults/ModalTextArea';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const NetworkDadForm: FC<ComponentEventWithChildren> = ({
	onDone,
	close,
	children,
}) => {
	const { isLoading, refetch, setNetworkData } = useAddLan(
		onDone ? onDone : () => {},
		close ? close : () => {},
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		refetch();
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<ModalInput
				setValue={(val: string) =>
					setNetworkData((prevData: any) => ({
						...prevData,
						externalAddress: val,
					}))
				}
				placeholder="External IP Address"
				required
			/>
			<ModalInput
				setValue={(val: string) =>
					setNetworkData((prevData: any) => ({
						...prevData,
						internalAddress: val,
					}))
				}
				placeholder="Internal IP Address"
				required
			/>

			<ModalTextArea
				setValue={(val: string) =>
					setNetworkData((prevData: any) => ({
						...prevData,
						desc: val,
					}))
				}
				placeholder="short description"
				maxLength={512}
				required
			/>
			{children(isLoading)}
		</form>
	);
};
