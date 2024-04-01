import { type FC } from 'react';
import { type Device } from '../../../../data';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
import { useAddLanV2 } from '@resourcesHooks/netowrk/useAddLanV2';

interface NetworkDeviceModalProps {
	close: () => void;
	onDone: () => void;
	internalNetwork: Device[];
}

export const AddNetworkDeviceModal: FC<NetworkDeviceModalProps> = (props) => {
	const { vendorName, isLoading, validators, refetch, setFormData } =
		useAddLanV2(props.onDone, props.close);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();

		if (validators()) return;
		refetch();
	};

	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData: any) => ({ ...prevData, [name]: value }));
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<select
						onChange={handleOnChange}
						className="log-inputs modal_info"
						name="mainDomainId"
						required>
						<option value="" disabled>
							main resource
						</option>
						{props.internalNetwork.map((resource: any) => (
							<option
								key={resource.id}
								value={
									resource.id
								}>{`${resource.device_name} - ${resource.device_ex_address}`}</option>
						))}
					</select>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<select
						onChange={handleOnChange}
						className="log-inputs modal_info"
						id="os-network-select"
						value={vendorName}
						name="vendorName"
						required>
						<option value="" disabled>
							os / vendor
						</option>
						<option value="windows">windows</option>
						<option value="linux">linux</option>
						<option value="unknown">unknown</option>
						<option value="android">android</option>
						<option value="ios">ios</option>
					</select>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleOnChange}
						placeholder="hostname"
						name="domainName"
						required
					/>
				</div>

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleOnChange}
						placeholder="internal IP"
						name="internalIpAddress"
						required
					/>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleOnChange}
						name="externalIpAddress"
						placeholder="external IP"></input>
				</div>
				<ModalButtons
					close={() => props.close?.()}
					confirmText="Add access point"
					isDisabled={isLoading}
				/>
			</form>
		</div>
	);
};
