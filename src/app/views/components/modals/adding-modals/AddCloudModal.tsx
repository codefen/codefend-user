import { type FC, useState } from 'react';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons } from '../..';
import { CloudService, useAuthState } from '../../../../data';

interface Props {
	onDone: () => void;
	close: () => void;
}

export const AddCloudModal: FC<Props> = (props) => {
	const [appName, setAppName] = useState('');
	const [provider, setProvider] = useState('');
	const [description, setDescription] = useState('');
	const [isAddingCloud, setAddingCloud] = useState(false);
	const { getCompany } = useAuthState();

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setAddingCloud(true);

		if (!provider.trim()) {
			toast.error('Select cloud provider');
			setAddingCloud(false);
			return;
		}

		if (!appName.trim() || appName.length > 150) {
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
		const company = getCompany();

		CloudService.add(requestParams, company)
			.then((response: any) => {
				if (response?.isAnError || Number(response.error) > 0) {
					throw new Error('An error has occurred on the server');
				}

				props.onDone();
				props.close();
				toast.success('Successfully Added Cloud...');
			})
			.finally(() => {
				setAddingCloud(false);
			});
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<select
						onChange={(e) => {
							setProvider(e.target.value);
						}}
						className="log-inputs modal_info"
						value={provider}
						id="select-provider-cloud"
						required>
						<option value="" disabled>
							Provider
						</option>
						<option value="azure">Azure</option>
						<option value="aws">AWS</option>
						<option value="google">Google</option>
					</select>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
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

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
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
	);
};
