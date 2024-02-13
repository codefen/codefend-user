import { toast } from 'react-toastify';
import { EditIcon, ModalButtons, PrimaryButton, SecondaryButton } from '..';
import {
	deleteCustomBaseAPi,
	getCustomBaseAPi,
	setCustomBaseAPi,
} from '../../../data';
import React, { useCallback, useState } from 'react';
import { baseUrl } from '../../../data/utils/config';

interface Props {
	close: () => void;
}

export const NetworkSetingModal: React.FC<Props> = ({ close }) => {
	const customAPi = getCustomBaseAPi();
	const defaultApiUrl = customAPi ? customAPi : baseUrl;
	const [apiUrl, setApiUrl] = useState(defaultApiUrl);
	const [canEdit, setCanEdit] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setCanEdit(false);
			setLoading(true);
			console.log('Execute');
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
			toast.success('Server has been changed successfully');
			close();
			setLoading(false);
			window.location.reload();
		},
		[apiUrl],
	);

	return (
		<>
			<div className="p-3 flex">
				<p className="text-left text-base title-format">Network Setting</p>
			</div>
			<form onSubmit={handleSubmit} className="p-4">
				<div className="flex flex-col">
					<div className=" flex items-center w-[32rem] gap-x-2">
						<input
							value={apiUrl}
							disabled={!canEdit}
							type="url"
							onChange={(e) => setApiUrl(e.target.value)}
							className={`block w-full py-3 bg-white border px-2 log-inputs focus:outline-none dark:text-gray-300 ${
								!canEdit && 'opacity-45'
							}`}
							placeholder="Enter API URI"
							list="api-urls"
							required
						/>
						<datalist id="api-urls">
							<option value="https://kundalini.codefend.com/kundalini/index.php"></option>
							<option value="https://api.codefend.com/kundalini/index.php"></option>
							<option value="https://api-mena.codefend.com/kundalini/index.php"></option>
						</datalist>
						<div
							onClick={() => setCanEdit((currentValue) => !currentValue)}
							className="cursor-pointer">
							<span
								className={`${
									!canEdit ? 'text-[#afafaf]' : 'text-[#ff3939]'
								} w-8 h-8 cursor-pointer`}>
								<EditIcon width={2} height={2} />
							</span>
						</div>
					</div>

					<span
						onClick={() => {
							deleteCustomBaseAPi();
							setApiUrl('');
							setCanEdit(false);
						}}
						className="underline text-right mr-10 mt-4 cursor-pointer codefend-text-red">
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
