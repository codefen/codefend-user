import { toast } from 'react-toastify';
import { EditIcon, PrimaryButton, SecondaryButton } from '..';
import {
	baseUrl,
	deleteCustomBaseAPi,
	getCustomBaseAPi,
	setCustomBaseAPi,
} from '../../../data';
import React, { useState } from 'react';

interface Props {
	close: () => void;
}

export const NetworkSetingModal: React.FC<Props> = ({ close }) => {
	const customApi = getCustomBaseAPi();
	const baseUrlToDisplay = baseUrl.slice(0, 9) + ''.padEnd(8, 'X');
	const defaultApiUrl = customApi ? customApi : baseUrlToDisplay;
	const [apiUrl, setApiUrl] = useState(defaultApiUrl);

	const [canEdit, setCanEdit] = useState(false);
	return (
		<>
			<div className="p-3 flex">
				<p className="text-left text-base title-format">Network Setting</p>
			</div>
			<form
				onSubmit={(e: React.FormEvent) => {
					e.preventDefault();
					setCanEdit(false);
					if (apiUrl.length < 10) {
						toast.error('invalid API URL, too short');
						return;
					}

					setCustomBaseAPi(apiUrl);
				}}>
				<div className="flex flex-col">
					<div className=" flex items-center w-[32rem] gap-x-2">
						<input
							value={apiUrl}
							disabled={!canEdit}
							type="url"
							onChange={(e) => {
								setApiUrl(e.target.value);
							}}
							className={`block w-full py-3 bg-white border px-2 log-inputs focus:outline-none dark:text-gray-300 ${
								!canEdit && 'opacity-45'
							}`}
							placeholder="Enter API URI"
							pattern="https://.*"
							required
						/>
						<div
							onClick={() => {
								setCanEdit((currentValue) => !currentValue);
							}}
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
							setApiUrl(baseUrlToDisplay);
						}}
						className="underline text-right mr-10 mt-4 cursor-pointer codefend-text-red">
						click here to set back to default
					</span>
				</div>
				<div
					className="mt-10 flex justify-center"
					onClick={(e: React.FormEvent) => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<SecondaryButton
						click={(e: any) => close()}
						text="Cancel"
						className="mr-2"
					/>
					<PrimaryButton
						type="submit"
						text="Save changes"
						click={() => {}}
						isDisabled={!canEdit}
						disabledLoader
					/>
				</div>
			</form>
			<div className="container flex items-center justify-center  mx-auto p-3 text-format"></div>
		</>
	);
};
