import React from 'react';
import { IoReload } from 'react-icons/io5';
import '../buttons.scss';
import './scanButtons.scss';

interface RefreshButtonProps {
	action: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
	return (
		<button className="btn scan-btn" onClick={props.action}>
			<div className="scan-container">
				<IoReload className="hover:animate-spin h-4 w-4 mr-2" />
				<p>REFRESH</p>
			</div>
		</button>
	);
};
