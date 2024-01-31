import React, { useEffect, useState } from 'react';
import { ImSpinner8 } from "react-icons/im";
import { Show } from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';

interface Props {
    scanLoading: boolean;
    scanLocal: () => void;
    onClick: () => void;
}

export const ScanButton: React.FC<Props> = ({ scanLoading, scanLocal, onClick }) => {
    const [message, setMessage] = useState('Performing scan');
	const { openModal } = useEndpointAppStore();


	useEffect(() => {
		if (scanLoading) {
			let stage = 1;
			let count = 0;
			const dotInterval = 700;
			const scanDuration = 20000;
			const iterationsForScanning = scanDuration / dotInterval;
	
			const interval = setInterval(() => {
				const dots = '.'.repeat(count % 3 + 1);
				const baseMessage = stage === 1 ? 'Performing scan' : 'Processing data';
				setMessage(`${baseMessage}${dots}`);
	
				count++;
				if (stage === 1 && count >= iterationsForScanning) {
					stage = 2;
					count = 0;
				}
			}, dotInterval);
	
			return () => clearInterval(interval);
		}
		return;
	}, [scanLoading]);

    return (
		<div className="ml-2 flex">
			<button
				className="cursor-pointer bg-white text-slate-300 border-slate-200 hover:bg-red-50 hover:text-red-300 hover:border-red-300 border h-8 text-xs rounded mr-2"
				onClick={onClick}
			>
				<Show when={scanLoading} fallback={<p className="cursor-pointer">REQUEST SCAN</p>}>
					<div className="w-full h-full flex items-center justify-left bg-transparent">
						<ImSpinner8 className="animate-spin h-4 w-4 text-red-400 mr-4" />
						<p>{message}</p>
					</div>
				</Show>
			</button>

			<button
                className={(scanLoading ? `bg-gray-200 cursor-default text-gray-300 border-gray-300 ` : `cursor-pointer bg-white text-slate-300 border-slate-200 hover:bg-red-50 hover:text-red-300 hover:border-red-300 `) + ` border h-8 text-xs rounded w-auto`}
                onClick={openModal}
                disabled={scanLoading}
            >
                <Show when={scanLoading} fallback={<p className="cursor-pointer">EXTERNAL SCAN</p>}>
                    <p className="cursor-default">REQUEST EXTERNAL SCAN</p>
                </Show>
            </button>
		</div>
    );
};