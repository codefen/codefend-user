import { type FC, useEffect, useState } from 'react';
import { AdminCompanyPanel } from './components/AdminCompanyPanel';
import AdminCompanyDetails from './components/AdminCompanyDetails';

const AdminCompany: FC = () => {
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
					{/* <div className="company-header title title-format">
						Admin Company Panel
					</div> */}
					<AdminCompanyPanel />
				</section>
				<section className="right">
					<AdminCompanyDetails />
				</section>
			</main>
		</>
	);
};

export default AdminCompany;
