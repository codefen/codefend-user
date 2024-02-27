import { useAuthState, LanApplicationService, Device } from '../../../data';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons } from '..';

interface NetworkDeviceModalProps {
	close: () => void;
	onDone: () => void;
	internalNetwork: Device[];
}

export const AddNetworkDeviceModal: React.FC<NetworkDeviceModalProps> = (
	props,
) => {
	const [
		{
			mainDomainId,
			domainName,
			vendorName,
			internalIpAddress,
			externalIpAddress,
			isAddingInternalNetwork,
		},
		setFormData,
	] = useState({
		domainName: '',
		vendorName: '',
		mainDomainId: 0,
		internalIpAddress: '',
		externalIpAddress: '',
		isAddingInternalNetwork: false,
	});

	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID;

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (!mainDomainId || mainDomainId === 0) {
			return toast.error('Invalid main resource');
		}

		if (!domainName.trim() || domainName.length == 0) {
			return toast.error('Invalid host name');
		}

		const requestBody = {
			device_name: domainName,
			device_os: vendorName,
			device_in_address: internalIpAddress,
			device_ex_address: externalIpAddress,
			resource_lan_dad: mainDomainId,
		};

		LanApplicationService.add(requestBody, companyID)
			.then(() => {
				toast.success('successfully added Sub Network...');
			})
			.finally(() => {
				props.close();
				props.onDone();
			});

		return;
	};

	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<>
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
						isDisabled={isAddingInternalNetwork}
					/>
				</form>
			</div>
		</>
	);
};
