import React from 'react';
import AdminPanelApprove from './components/AdminPanelApprove';
import './adminUser.scss';

const AdminUserLayout: React.FC = () => {
	return (
		<>
			<main className="admin-user">
				<section className="left">
					<div className="left-section-title title title-format">
						Admin Panel
					</div>
					<AdminPanelApprove />
				</section>
				<section className="right">
					<div className="right-section-title title title-format"></div>
				</section>
			</main>
		</>
	);
};

export default AdminUserLayout;
