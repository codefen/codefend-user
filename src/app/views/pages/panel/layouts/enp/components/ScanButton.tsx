import { type FC, useEffect, useState } from 'react';
import {
	ExternalScanButton,
	RequestScanButton,
} from '../../../../../components';
import { useEndpointAppStore } from '../EndpointContext';

interface ScanButtonProps {
	scanLoading: boolean;
	scanLocal: () => void;
	onClick: () => void;
}

export const ScanButton: FC<ScanButtonProps> = ({
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
		<div className="scan-btn-container">
			<RequestScanButton
				scanLoading={scanLoading}
				message={message}
				action={onClick}
			/>

			<ExternalScanButton action={openModal} scanLoading={scanLoading} />
		</div>
	);
};
