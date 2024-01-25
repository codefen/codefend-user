import { useAuthState, useModal, LanApplicationService } from '../../../data';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { GlobeWebIcon, PrimaryButton, SecondaryButton } from '..';

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

	const [networkData, setNetworkData] = useState<NetworkData>({
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

	const {
		domainName,
		vendorName,
		username,
		password,
		isAddingInternalNetwork,
	} = networkData;

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

		if (!username.trim() || username.length == 0) {
			toast.error('Invalid username');
			return setNetworkData((prevData) => ({
				...prevData,
				isAddingInternalNetwork: false,
			}));
		}

		if (!password.trim() || password.length == 0) {
			toast.error('Invalid password');
			return setNetworkData((prevData) => ({
				...prevData,
				isAddingInternalNetwork: false,
			}));
		}

		const requestParams = {
			device_name: networkData.domainName,
			device_version: networkData.vendorName,
			access_username: networkData.username,
			access_password: networkData.password,
			device_in_address: networkData.internalAddress,
			device_ex_address: networkData.externalAddress,
		};

		LanApplicationService.add(requestParams, companyID)
			.then(() => {
				props.onDone();
				setShowModal(!showModal);
				toast.success('successfully added Access Point...');
			})
			.finally(() => {
				setNetworkData((prevData) => ({
					...prevData,
					isAddingInternalNetwork: false,
				}));
			});
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
							onChange={handleChange}
							className="log-inputs modal_info"
							value={networkData.vendorName}
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
							onChange={handleChange}
							placeholder="username"
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
							type="password"
							onChange={handleChange}
							placeholder="password"
							required
						/>
					</div>
					<div className="form-buttons">
						<SecondaryButton
							text={'Cancel'}
							click={() => props.close()}
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

export default AcessPointModal;
