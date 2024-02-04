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
			<main className={`company ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<div className="company-header title title-format">
						Admin Company Panel
					</div>
					<AdminCompanyPanel />
				</section>
				<section className="right">
					<div className="company-details-container title title-format">
						<AdminCompanyDetails />
					</div>
				</section>
			</main>
		</>
	);
};

export default AdminCompanyLayout;
