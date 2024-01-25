import { useAuthState, LanApplicationService } from '../../../data';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { GlobeWebIcon, PrimaryButton, SecondaryButton } from '..';

interface NetworkDeviceModalProps {
	close: () => void;
	onDone: () => void;
	internalNetwork: {
		id: number;
		device_name: string;
		device_ex_address: string;
	}[];
}

export const AddNetworkDeviceModal: React.FC<NetworkDeviceModalProps> = (
	props,
) => {
	const [formData, setFormData] = useState({
		domainName: '',
		vendorName: '',
		mainDomainId: 0,
		internalIpAddress: '',
		externalIpAddress: '',
		isAddingInternalNetwork: false,
	});

	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID;

	const navigate = useNavigate();

	const {
		mainDomainId,
		domainName,
		vendorName,
		internalIpAddress,
		externalIpAddress,
		isAddingInternalNetwork,
	} = formData;

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
				navigate(0);
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
			<div className="modal text-format">
				<form className="flex flex-col gap-y-3">
					<div className="form-input">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<select
							onChange={handleOnChange}
							className="log-inputs modal_info"
							value={formData.domainName}
							name="domainName"
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
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<select
							onChange={handleOnChange}
							className="log-inputs modal_info"
							id="os-network-select"
							value={formData.vendorName}
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
					<div className="form-input text">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							onChange={handleOnChange}
							placeholder="hostname"
							required
						/>
					</div>

					<div className="form-input text">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							onChange={handleOnChange}
							placeholder="internal IP"
							required
						/>
					</div>
					<div className="form-input text">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							onChange={handleOnChange}
							placeholder="external IP"></input>
					</div>
					<div className="form-buttons">
						<SecondaryButton
							text="Cancel"
							click={(e: React.FormEvent) => props.close?.()}
							isDisabled={isAddingInternalNetwork}
							className="btn-cancel codefend_secondary_ac"
						/>
						<PrimaryButton
							text="Add access point"
							click={handleSubmit}
							isDisabled={isAddingInternalNetwork}
							className="btn-add codefend_main_ac"
						/>
					</div>
				</form>
			</div>
		</>
	);
};
