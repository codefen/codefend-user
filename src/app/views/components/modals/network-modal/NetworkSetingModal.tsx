import { toast } from 'react-toastify';
import { EditIcon, ModalButtons } from '../..';
import {
	deleteCustomBaseAPi,
	getCustomBaseAPi,
	setCustomBaseAPi,
	useAuthState,
} from '../../../../data';
import { type FC, useCallback, useState } from 'react';
import { baseUrl } from '../../../../data/utils/config';
import './networkSetting.scss';

interface NetworkSetingModalProps {
	close: () => void;
}

export const NetworkSetingModal: FC<NetworkSetingModalProps> = ({ close }) => {
	const customAPi = getCustomBaseAPi();
	const defaultApiUrl = customAPi ? customAPi : baseUrl;
	const [apiUrl, setApiUrl] = useState(defaultApiUrl);
	const [canEdit, setCanEdit] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const { logout } = useAuthState();
	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setCanEdit(false);
			setLoading(true);
			if (apiUrl.length < 10) {
				toast.error('invalid API URL, too short');
				setLoading(false);
				return;
			}
			if (apiUrl === defaultApiUrl) {
				toast.error('This API is currently active');
				setLoading(false);
				return;
			}

			setCustomBaseAPi(apiUrl);
			//toast.success('Server has been changed successfully');
			close();
			setLoading(false);
			logout();
			window.location.reload();
		},
		[apiUrl],
	);

	return (
		<>
			<header className="network-header">
				<h4 className="network-header_title title-format">
					Network Setting
				</h4>
			</header>
			<form onSubmit={handleSubmit} className="network-form">
				<div className="network-form_inputs">
					<div className="network-form_inputs_edit">
						<input
							value={apiUrl}
							disabled={!canEdit}
							type="url"
							onChange={(e) => setApiUrl(e.target.value)}
							className={` log-inputs ${!canEdit && 'opacity'}`}
							placeholder="Enter API URI"
							list="api-urls"
							required
						/>
						<datalist id="api-urls">
							<option value="https://kundalini.codefend.com/kundalini/index.php"></option>
							<option value="https://api.codefend.com/kundalini/index.php"></option>
							<option value="https://api-mena.codefend.com/kundalini/index.php"></option>
							<option value="https://kundalini-usa.codefend.com/kundalini/"></option>
						</datalist>
						<button
							onClick={() => setCanEdit((currentValue) => !currentValue)}
							type="button"
							className="edit-btn">
							<span
								className={`edit-btn_icon ${!canEdit ? 'off' : 'on'}`}>
								<EditIcon width={2} height={2} />
							</span>
						</button>
					</div>

					<span
						onClick={() => {
							deleteCustomBaseAPi();
							setApiUrl(baseUrl);
							setCanEdit(false);
							close();
							toast.success('Server has been changed successfully');
						}}
						className="network-form_inputs_edit_reset codefend-text-red">
						click here to set back to default
					</span>
				</div>

				<ModalButtons
					close={() => close()}
					isDisabled={isLoading}
					confirmText="Save changes"
				/>
			</form>
		</>
	);
};
