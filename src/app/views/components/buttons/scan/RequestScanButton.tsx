import { ImSpinner8 } from 'react-icons/im';
import { Show } from '../..';
import '../buttons.scss';

interface RequestScanButtonProps {
	scanLoading: boolean;
	message: string;
	action: () => void;
}

export const RequestScanButton: React.FC<RequestScanButtonProps> = (props) => {
	return (
		<button className="btn scan-btn" onClick={props.action}>
			<Show
				when={props.scanLoading}
				fallback={<p className="cursor-pointer">REQUEST SCAN</p>}>
				<div className="message">
					<ImSpinner8 className="animate-spin h-4 w-4 text-red-400 mr-4" />
					<p>{props.message}</p>
				</div>
			</Show>
		</button>
	);
};
