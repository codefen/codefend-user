import React, { useEffect, useState } from 'react';
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { Show } from '../../../../../components';
import {
	getCustomBaseAPi,
} from '../../../../../../data';

import { useEndpointAppStore } from '../EndpointContext';
import { toast } from 'react-toastify';

import {
	useAuthState
} from '../../../../../../data';

import { baseUrl } from '../../../../../../data/utils/config';

interface Props {}

type OsOptions = {
	[key: string]: string;
	windows: string;
	mac: string;
	linux: string;
};

export const ModalOS: React.FC<Props> = () => {
    const { getAccessToken, getCompany } = useAuthState();
	const { closeModal, isModalOpen } = useEndpointAppStore();

    const [selectedOS, setSelectedOS] = useState<string>('windows');
    const [showModal, setShowModal] = useState(false);

	const customAPi = getCustomBaseAPi();
	const _baseUrl = customAPi ? customAPi : baseUrl;
    let parsedUrl = new URL(_baseUrl);
    let reducedUrl = `${parsedUrl.host}${parsedUrl.pathname}`.replace(/\/[^\/]*$/, '');

	const osOptions: OsOptions = {
        windows: `Invoke-WebRequest -Uri "https://web.codefend.com/releases/codefend-windows.exe" -OutFile "$env:TEMPcodefend-windows.exe"; & "$env:TEMPcodefend-windows.exe" '${getAccessToken()}' '${getCompany()}' '${reducedUrl}'; Pause; Remove-Item "$env:TEMPcodefend-windows.exe"`,
        mac: 'Mac Command',
        linux: `wget https://web.codefend.com/releases/codefend-linux -O /tmp/codefend-linux && chmod +x /tmp/codefend-linux && /tmp/codefend-linux ${getAccessToken()} ${getCompany()} ${reducedUrl}; rm /tmp/codefend-linux`
    };

	const copyToClipboard = async (text: string) => {
	  try {
		await navigator.clipboard.writeText(text);
		toast.success("Text copied to clipboard");
	  } catch (err) {
		console.error('Failed to copy text: ', err);
	  }
	};

    const handleSelectOS = (os: string) => {
        setSelectedOS(os);
    };

	useEffect(() => {
		if (isModalOpen) {
		  return setShowModal(true);
		}
		return setShowModal(false);
	  }, [isModalOpen])

    return (
		showModal && (
			<div id="select-modal" onClick={closeModal} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div onClick={(event) => event.stopPropagation()} className="relative p-4 w-full max-w-md h-full md:h-auto">
					<div className="relative bg-white rounded shadow dark:bg-gray-700">
						<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Select an Operating System
							</h3>
						</div>
						<div className="p-4 md:p-5">
							<div className="flex justify-around mb-8">
								<div className="flex flex-col items-center cursor-pointer" onClick={() => handleSelectOS('windows')}>
									<div className={`p-6 border ${selectedOS === 'windows' ? 'border-red-400 text-red-400' : 'border-gray-200 text-gray-400'} rounded-lg duration-300 ease-in-out`}>
										<FaWindows className='h-8 w-8'/>
									</div>
								</div>

								<div className="flex flex-col items-center cursor-pointer" onClick={() => handleSelectOS('linux')}>
									<div className={`p-6 border ${selectedOS === 'linux' ? 'border-red-400 text-red-400' : 'border-gray-200 text-gray-400'} rounded-lg text-gray-400 duration-300 ease-in-out`}>
										<FaLinux className='h-8 w-8'/>
									</div>
								</div>

								<div className="flex flex-col items-center cursor-no-drop"
									onClick={() => 
									//handleSelectOS('mac')
									true
								}>
									<div className={`p-6 border ${selectedOS === 'mac' ? 'border-red-400 text-red-400' : 'border-gray-300 text-gray-400'} bg-gray-200 rounded-lg text-gray-400 duration-300 ease-in-out`}>
										<FaApple className='h-8 w-8'/>
									</div>
								</div>
							</div>
							{selectedOS && (
								<div className="mb-4">
									<p className="text-gray-500 text-sm mb-2">Use the following command in the target device:</p>
									<div className="p-3 bg-gray-100 text-gray-400 border border-gray-400 rounded hover:bg-gray-200 cursor-pointer duration-300 ease-in-out overflow-hidden"
										onClick={() => copyToClipboard(osOptions[selectedOS])}
									>
										<pre className="whitespace-nowrap overflow-hidden text-overflow-ellipsis">{osOptions[selectedOS]}</pre>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		)
    );
};