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
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
			<button
				className="cursor-pointer border h-16 bg-white text-red-400 rounded hover:bg-red-100 border-red-400 w-full"
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
                className={(scanLoading ? `bg-gray-200 cursor-default text-gray-300 border-gray-300 ` : `cursor-pointer bg-white text-red-400 border-red-400 hover:bg-red-100 `) + ` border h-16 rounded w-full`}
                onClick={openModal}
                disabled={scanLoading}
            >
                <Show when={scanLoading} fallback={<p className="cursor-pointer">REQUEST EXTERNAL SCAN</p>}>
                    <p className="cursor-default">REQUEST EXTERNAL SCAN</p>
                </Show>
            </button>
		</div>
    );
};