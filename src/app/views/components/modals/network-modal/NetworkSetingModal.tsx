import { type FC, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { EditIcon, ShieldOffIcon, ShieldOnIcon } from '@icons';
import Show from '@defaults/Show.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import {
	deleteCustomBaseAPi,
	getCustomBaseAPi,
	setCustomBaseAPi,
} from '@utils/helper.ts';
import { useAuthState } from '#commonHooks/useAuthState.ts';
import { baseUrl } from '@utils/config.ts';
import './networkSetting.scss';
import { PrimaryButton } from '../..';

interface NetworkSetingModalProps {
	isOpen: boolean;
	close: () => void;
}

export const NetworkSetingModal: FC<NetworkSetingModalProps> = ({
	close,
	isOpen,
}) => {
	const [insecure, setInsecure] = useState(
		localStorage.getItem('insecure') == 'true' ? true : false,
	);
	const customAPi = getCustomBaseAPi();
	const defaultApiUrl = customAPi ? customAPi : baseUrl;
	const [apiUrl, setApiUrl] = useState(defaultApiUrl);
	const [canEdit, setCanEdit] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const { logout } = useAuthState();
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCanEdit(false);
		setLoading(true);

		if (apiUrl.length < 10) {
			toast.error('invalid API URL, too short');
			setLoading(false);
			return;
		}
		localStorage.setItem('insecure', String(insecure));
		close();
		setLoading(false);
		if (apiUrl !== defaultApiUrl) {
			setCustomBaseAPi(apiUrl);
			toast.success('Server has been changed successfully');
			logout();
			window.location.reload();
		}
	};

	const handleCancel = () => {
		close();
		setInsecure(localStorage.getItem('insecure') == 'true' ? true : false);
	};

	const updateInsecure = () => setInsecure((prev) => !prev);

	return (
		<Show when={isOpen}>
			<ModalWrapper action={close}>
				<div
					className="modal-wrapper-title internal-tables disable-border"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<div className="network-modal-container">
						<div className="network-modal-content disable-border">
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
											onClick={() =>
												setCanEdit((currentValue) => !currentValue)
											}
											type="button"
											className="edit-btn">
											<span
												className={`edit-btn_icon ${!canEdit ? 'off' : 'on'}`}>
												<EditIcon width={2} height={2} />
											</span>
										</button>
									</div>

									<div className="network-form_inputs_extra">
										<PrimaryButton
											text={
												!insecure ? (
													<ShieldOnIcon />
												) : (
													<ShieldOffIcon />
												)
											}
											buttonStyle="gray"
											click={() => updateInsecure()}
											disabledLoader
											type="button"
											className="network-form_inputs_extra_insecure"
										/>

										<span
											onClick={() => {
												deleteCustomBaseAPi();
												setApiUrl(baseUrl);
												setCanEdit(false);
												close();
												toast.success(
													'Server has been changed successfully',
												);
											}}
											className="network-form_inputs_extra_reset codefend-text-red">
											click here to set back to default
										</span>
									</div>
								</div>

								<ModalButtons
									close={handleCancel}
									isDisabled={isLoading}
									confirmText="Save changes"
								/>
							</form>
						</div>
					</div>
				</div>
			</ModalWrapper>
		</Show>
	);
};
