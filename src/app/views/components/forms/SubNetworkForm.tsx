import { type FC } from 'react';
import { type ComponentEventWithChildren, type Device } from '../../../data';
import { GlobeWebIcon } from '@icons';
import { useAddLanV2 } from '@resourcesHooks/netowrk/useAddLanV2';
import { ModalInput } from '@defaults/ModalInput';
import { ModalTextArea } from '@defaults/ModalTextArea';

interface SubNetworkFormProps extends ComponentEventWithChildren {
	internalNetwork: Device[];
}

const SubNetworkForm: FC<SubNetworkFormProps> = ({
	close,
	onDone,
	children,
	internalNetwork,
}) => {
	const { mainDomainId, isLoading, validators, refetch, setFormData } =
		useAddLanV2(onDone ? onDone : () => {}, close ? close : () => {});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();

		if (validators()) return;
		refetch();
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<div className="form-input">
				<span className="icon">
					<GlobeWebIcon />
				</span>

				<select
					onChange={(e) =>
						setFormData((prevData: any) => ({
							...prevData,
							mainDomainId: e.target.value,
						}))
					}
					className="log-inputs modal_info"
					name="mainDomainId"
					value={mainDomainId}
					required>
					<option value="0" disabled hidden>
						main resource
					</option>
					{internalNetwork.map((resource: any) => (
						<option
							key={resource.id}
							value={
								resource.id
							}>{`${resource.device_ex_address}`}</option>
					))}
				</select>
			</div>
			<ModalInput
				setValue={(val: string) =>
					setFormData((prevData: any) => ({
						...prevData,
						externalIpAddress: val,
					}))
				}
				placeholder="external IP"
			/>
			<ModalInput
				setValue={(val: string) =>
					setFormData((prevData: any) => ({
						...prevData,
						internalIpAddress: val,
					}))
				}
				placeholder="internal IP"
				required
			/>
			<ModalTextArea
				setValue={(val: string) =>
					setFormData((prevData: any) => ({
						...prevData,
						desc: val,
					}))
				}
				placeholder="short description"
				maxLength={600}
			/>
			{children(isLoading)}
		</form>
	);
};

export default SubNetworkForm;
