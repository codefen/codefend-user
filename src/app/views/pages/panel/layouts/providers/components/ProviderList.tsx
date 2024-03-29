import { useState } from 'react';
import { ProviderCard } from './provider-card/ProviderCard';

export const ProviderList = () => {
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');

	return (
		<div className="providers-list">
			<h2>Providers</h2>

			<ProviderCard
				name="Indila Indigo"
				username="indila"
				desc="Web chaos since 2008"
				img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
				rating={4}
				score={4.55}
				totalReviews="236"
				handleActivate={handleActive}
				id="1"
				isSelected={active === '1'}
			/>
			<ProviderCard
				name="Edd krause"
				username="edd"
				desc="Offensive security researcher"
				img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
				rating={3}
				score={4.55}
				totalReviews="186"
				handleActivate={handleActive}
				id="2"
				isSelected={active === '2'}
			/>
			<ProviderCard
				name="Gaspar Onesto"
				username="onesto"
				desc="Got for the win"
				img="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
				rating={3}
				score={4.55}
				totalReviews="352"
				handleActivate={handleActive}
				id="3"
				isSelected={active === '3'}
			/>
		</div>
	);
};
