import React, { useEffect, useState } from 'react';
import { IoReload } from "react-icons/io5";

interface Props {
    onClick: () => void;
}

export const ReportButton: React.FC<Props> = ({ onClick }) => {

    return (
		<div className="ml-4 flex">
			<button
				className="cursor-pointer bg-white text-slate-300 border-slate-200 hover:bg-red-50 hover:text-red-300 hover:border-red-300 border h-8 text-xs rounded mr-2"
				onClick={onClick}
			>
				<div className="w-full h-full flex items-center justify-left bg-transparent">
					<IoReload className="hover:animate-spin h-4 w-4 mr-2" />
					<p>REFRESH</p>
				</div>
				
			</button>
			<button
				className="cursor-pointer bg-white text-slate-300 border-slate-200 hover:bg-red-50 hover:text-red-300 hover:border-red-300 border h-8 text-xs rounded mr-2"
				onClick={onClick}
			>
				<p>GENERATE REPORT</p>
			</button>
		</div>
    );
};