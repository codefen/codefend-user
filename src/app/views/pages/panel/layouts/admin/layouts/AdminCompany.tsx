import React, { useEffect, useState } from 'react';
import { AdminCompanyPanel } from './components/InternalNetworks';
import AdminCompanyDetails from './components/AdminCompanyDetails';
import './admin.scss'

const AdminCompanyLayout: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowScreen(true);
		}, 50);
	});

	return (
		<>
			<main className={`webapp ${showScreen ? 'actived' : ''}`}>
				<section className="left2">
					<div className="pb-[20px] title title-format h-16">
						Admin Company Panel
					</div>
					<AdminCompanyPanel />
				</section>
				<section className="right2">
					<div className="mt-16 pb-9 title title-format h-16">
						<AdminCompanyDetails />
					</div>
				</section>
			</main>
		</>
	);
};

export default AdminCompanyLayout;
