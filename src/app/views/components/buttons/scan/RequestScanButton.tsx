import { type FC } from 'react';
import { ButtonLoader, Show } from '../..';
import '../buttons.scss';
import './scanButtons.scss';

interface RequestScanButtonProps {
	scanLoading: boolean;
	message: string;
	action: () => void;
}

export const RequestScanButton: FC<RequestScanButtonProps> = (props) => {
	return (
		<button className="btn scan-btn" onClick={props.action}>
			<Show when={props.scanLoading} fallback={<p>REQUEST SCAN</p>}>
				<div className="message">
					<ButtonLoader />
					<p>{props.message}</p>
				</div>
			</Show>
		</button>
	);
};
