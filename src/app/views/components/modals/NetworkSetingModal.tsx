import { toast } from 'react-toastify';
import { CopyIcon, EditIcon, PrimaryButton, SecondaryButton } from '..';
import {
	NetworkSettingState,
	apiLinks,
	baseUrl,
	deleteCustomBaseAPi,
	getCustomBaseAPi,
	setCustomBaseAPi,
	useNetworkSettingState,
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
	const { setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	const [isCopied, setIsCopied] = useState({ state: false, url: '' });

	const isEnabled = (url: string) => {
		if (!url) return false;
		return apiUrl === url;
	};

	return (
		<>
			<div className="p-2 flex items-center justify-between">
				<p className="text-left text-base title-format">Network Setting</p>

				<span
					onClick={() => {
						setNetworkSettingState(false);
					}}
					className="p-2 font-700 text-xl text-black cursor-pointer">
					X
				</span>
			</div>

			<div className="flex flex-col gap-y-5">
				{apiLinks.map((api, apiIndex) => (
					<div
						key={`api_link${apiIndex}`}
						className="flex items-center gap-x-2 font-bold text-[15px]">
						<span className="font-bold text-[14px] text-black">
							{apiIndex + 1}.
						</span>
						<span className="font-bold text-[14px] text-black">
							{api.name}
						</span>
						<div className="flex items-center bg-orange-500 w-[60%]">
							<span
								className={`  truncate ${
									isEnabled(api.url) ? `codefend-text-red ` : ''
								}`}>
								{api.url}
							</span>
							<span
								onClick={() => {
									navigator.clipboard.writeText(api.url);
									setIsCopied({ state: true, url: api.url });
									setTimeout(() => {
										setIsCopied({ state: false, url: '' });
									}, 800);
								}}
								className={` ml-[0.2rem] cursor-pointer ${
									isCopied.state && isCopied.url === api.url
										? 'text-green-500'
										: ''
								}`}>
								<CopyIcon />
							</span>
						</div>
						<span
							onClick={() => {
								if (isEnabled(api.url)) return;

								setCustomBaseAPi(api.url);
								setApiUrl(api.url);
							}}
							className={`underline ml-4  ${
								isEnabled(api.url)
									? `text-green-500`
									: 'text-black cursor-pointer'
							}`}>
							{isEnabled(api.url) ? 'Active' : 'Click to Enable'}
						</span>
					</div>
				))}
			</div>
			<div className="container flex items-center justify-center  mx-auto p-3 text-format"></div>
		</>
	);
};
