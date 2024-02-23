import { useAuthState, useModal, LanApplicationService } from '../../../data';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons, PrimaryButton, SecondaryButton } from '..';

interface NetworkData {
	domainName: string;
	vendorName: string;
	username: string;
	password: string;
	internalAddress: string;
	externalAddress: string;
	isAddingInternalNetwork: boolean;
}

export const AcessPointModal: React.FC<{
	onDone: () => void;
	close: () => void;
}> = (props) => {
	const { getUserdata } = useAuthState();
	const companyID = getUserdata()?.companyID;

	const [
		{
			domainName,
			vendorName,
			username,
			password,
			internalAddress,
			externalAddress,
			isAddingInternalNetwork,
		},
		setNetworkData,
	] = useState<NetworkData>({
		domainName: '',
		vendorName: '',
		username: '',
		password: '',
		internalAddress: '',
		externalAddress: '',
		isAddingInternalNetwork: false,
	});

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setNetworkData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const { showModal, setShowModal } = useModal();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setNetworkData((prevData) => ({
			...prevData,
			isAddingInternalNetwork: true,
		}));

		if (!domainName.trim() || domainName.length == 0) {
			toast.error('Invalid host name');
			return setNetworkData((prevData) => ({
				...prevData,
				isAddingInternalNetwork: false,
			}));
		}

		if (!vendorName.trim()) {
			toast.error('Invalid vendor name');
			return setNetworkData((prevData) => ({
				...prevData,
				isAddingInternalNetwork: false,
			}));
		}

		const requestParams = {
			device_name: domainName,
			device_version: vendorName,
			access_username: username,
			access_password: password,
			device_in_address: internalAddress,
			device_ex_address: externalAddress,
		};

		LanApplicationService.add(requestParams, companyID).then((res: any) => {
			setShowModal(!showModal);

			if (res.error == 1) {
				let message = res.info.includes('device_in_address')
					? 'Device internal address is invalid'
					: res.info.includes('device_ex_address')
						? 'device external address is invalid'
						: 'An unexpected error has occurred on the server';

				toast.error(message);
				setNetworkData((prevData) => ({
					...prevData,
					isAddingInternalNetwork: false,
				}));
				return;
			}
			toast.success('successfully added Access Point...');
			setNetworkData((prevData) => ({
				...prevData,
				isAddingInternalNetwork: false,
			}));

			props.close();
			props.onDone();
		});
	};

	return (
		<>
			<div className="modal text-format">
				<form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
					<div className="form-input">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>
						<select
							onChange={handleChange}
							className="log-inputs modal_info"
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
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							name="domainName"
							onChange={handleChange}
							placeholder="hostname"
							required
						/>
					</div>
					<div className="form-input">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							name="internalAddress"
							value={internalAddress}
							onChange={handleChange}
							placeholder="Internal IP Address"
							required
						/>
					</div>
					<div className="form-input">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							name="externalAddress"
							value={externalAddress}
							onChange={handleChange}
							placeholder="External IP Address"
							required
						/>
					</div>

					<div className="form-input">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							name="username"
							onChange={handleChange}
							placeholder="username"
						/>
					</div>
					<div
						className="form-input"
						onClick={(e: any) => {
							e.preventDefault();
							e.stopPropagation();
						}}>
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="password"
							name="password"
							onChange={handleChange}
							placeholder="Password"
						/>
					</div>
					<ModalButtons
						confirmText="Add access point"
						isDisabled={isAddingInternalNetwork}
						close={() => props.close()}
					/>
				</form>
			</div>
		</>
	);
};

export default AcessPointModal;
