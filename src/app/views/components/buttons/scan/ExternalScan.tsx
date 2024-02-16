import React from 'react';
import { Show } from '../..';
import '../buttons.scss';
import { ImSpinner8 } from 'react-icons/im';

interface RequestScanButtonProps {
	scanLoading: boolean;
	action: () => void;
}

export const ExternalScanButton: React.FC<RequestScanButtonProps> = (props) => {
	return (
		<button
			className="btn scan-btn"
			onClick={props.action}
			disabled={props.scanLoading}>
			<Show
				when={props.scanLoading}
				fallback={<p className="cursor-pointer">EXTERNAL SCAN</p>}>
				<div className="message">
					<ImSpinner8 className="animate-spin h-4 w-4 text-red-400 mr-4" />
					<p className="cursor-default">REQUEST EXTERNAL SCAN</p>
				</div>
			</Show>
		</button>
	);
};
