import React from 'react';
import { IoReload } from 'react-icons/io5';
import '../buttons.scss';

interface RefreshButtonProps {
	action: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
	return (
		<button className="btn scan-btn" onClick={props.action}>
			<div className="w-full h-full flex items-center justify-left bg-transparent">
				<IoReload className="hover:animate-spin h-4 w-4 mr-2" />
				<p>REFRESH</p>
			</div>
		</button>
	);
};
