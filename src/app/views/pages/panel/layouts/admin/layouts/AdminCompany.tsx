import { EmptyScreenView } from '../../../../../components';
import React, { useEffect, useState } from 'react';
import { AdminCompanyPanel } from './components/InternalNetworks';
import AdminCompanyDetails from './components/AdminCompanyDetails';

interface Props {}

const AdminCompanyLayout: React.FC<Props> = (props) => {
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
    setTimeout(() => {
      setShowScreen(true);
    }, 50);
  });

	return (
		<>
			<main className={`webapp ${showScreen ? 'actived' : ''}`}>
				<section className="w-8/12 pr-2">
					<div className="pb-[20px] title title-format h-16">
						Admin Company Panel
					</div>
					<AdminCompanyPanel />
				</section>
				 <section className="w-4/12 pl-2">
					<div className="mt-16 pb-9 title title-format h-16">
						<AdminCompanyDetails />
					</div>
				</section>   
			</main>
		</>
	);
};

export default AdminCompanyLayout;
