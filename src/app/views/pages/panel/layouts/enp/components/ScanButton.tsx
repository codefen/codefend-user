import React, { useEffect, useState } from 'react';
import {
	ExternalScanButton,
	RequestScanButton,
} from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';

interface Props {
	scanLoading: boolean;
	scanLocal: () => void;
	onClick: () => void;
}

export const ScanButton: React.FC<Props> = ({
	scanLoading,
	scanLocal,
	onClick,
}) => {
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
				const dots = '.'.repeat((count % 3) + 1);
				const baseMessage =
					stage === 1 ? 'Performing scan' : 'Processing data';
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
			<RequestScanButton
				scanLoading={scanLoading}
				message={message}
				action={onClick}
			/>

			<ExternalScanButton action={openModal} scanLoading={scanLoading} />
		</div>
	);
};
