import { useAuthState } from '../../../data';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons } from '..';
import { CloudService } from '../../../data';

interface Props {
	onDone: () => void;
	close: () => void;
}

export const AddCloudModal: React.FC<Props> = (props) => {
	const [appName, setAppName] = useState('');
	const [provider, setProvider] = useState('');
	const [description, setDescription] = useState('');
	const [isAddingCloud, setAddingCloud] = useState(false);
	const { getUserdata } = useAuthState();

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setAddingCloud(true);

		if (!provider.trim()) {
			toast.error('Select cloud provider');
			setAddingCloud(false);
			return;
		}

		if (!appName.trim() || appName.length == 0 || appName.length > 150) {
			toast.error('Invalid app name');
			setAddingCloud(false);
			return;
		}

		const requestParams = {
			llave_1: '',
			llave_2: '',
			llave_3: '',
			provider: provider,
			name: appName,
			desc: description,
		};
		const company = getUserdata()?.companyID as string;

		CloudService.add(requestParams, company)
			.then(() => {
				props.onDone();
				toast.success('Successfully Added Cloud...');
			})
			.finally(() => {
				setAddingCloud(false);
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
							onChange={(e) => {
								setProvider(e.target.value);
							}}
							className="log-inputs modal_info"
							value={provider}
							id="select-provider-cloud"
							required>
							<option value="" disabled selected>
								Provider
							</option>
							<option value="azure">Azure</option>
							<option value="aws">AWS</option>
							<option value="google">Google</option>
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
							onChange={(e) => {
								setAppName(e.target.value);
							}}
							placeholder="name"
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
							onChange={(e) => {
								setDescription(e.target.value);
							}}
							placeholder="description"
							required
						/>
					</div>

					<ModalButtons
						close={props.close}
						isDisabled={isAddingCloud}
						confirmText="Add cloud"
					/>
				</form>
			</div>
		</>
	);
};
