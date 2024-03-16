import React from 'react';
import '../buttons.scss';
import './scanButtons.scss';
import { ButtonLoader } from '../..';

interface RefreshButtonProps {
	action: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
	return (
		<button className="btn scan-btn" onClick={props.action}>
			<div className="scan-container">
				<ButtonLoader />
				<p>REFRESH</p>
			</div>
		</button>
	);
};
