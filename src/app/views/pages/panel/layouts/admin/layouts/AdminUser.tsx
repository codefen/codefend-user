import { EmptyScreenView } from '../../../../../components';
import React from 'react';
import AdminPanelApprove from './components/AdminPanelApprove';

interface Props {}

const AdminUserLayout: React.FC<Props> = (props) => {
	return (
		<>
			<main className="pt-12 p-8">
				<section className="w-8/12 pr-2">
					<div className="pb-[20px] title title-format h-16">Admin Panel</div>
					<AdminPanelApprove />
				</section>
				<section className="w-4/12 pl-2">
					<div className="pb-9 title title-format h-16"></div>
				</section>
			</main>
		</>
	);
};

export default AdminUserLayout;
