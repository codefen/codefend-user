import React, { useEffect, useState } from 'react';
import {
	LocationIcon,
	ProfileMedia,
	StarRating,
	VerificationIcons,
} from '../../../../components';
import { AboutProvider } from './layouts/AboutProvider';
import { ProviderSidebar } from './components/ProviderSidebar';
import { ProviderList } from './components/ProviderList';
import './provider.scss';

export const ProviderPage = () => {
	const [showScreen, setShowScreen] = useState(false);
	useEffect(() => {
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<main className={`provider ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<div className="provider-header">
					<div className="provider-banner-container">
						<img
							className="provider-banner"
							src="https://t4.ftcdn.net/jpg/02/71/29/75/360_F_271297554_0DAlzyFb8jzYg0lfmUOzyhtMer0orz4h.jpg"
							alt="banner"
							aria-label="provider banner"
						/>
					</div>
					<ProfileMedia
						borderWhite
						src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
						top="12rem"
						left="2.5rem"
					/>

					<div className="provider-header-content">
						<div className="provider-main-info">
							<h3>Indila indigo</h3>
							<h4>Offensive security researcher</h4>
							<span>Member since November 2023</span>
						</div>

						<div className="provider-extra-info">
							<div className="provider-verification">
								<VerificationIcons />

								<p>
									<span className="highlight">Deal confidence</span>{' '}
									address & identity verified
								</p>
							</div>
							<div className="provider-info-wrapper">
								<div className="provider-finish-audit">
									<span className="audit-count">246</span>
									<span className="audit-title">Finished Audits</span>
								</div>
								<div className="provider-score-local">
									<span className="provider-local">
										<LocationIcon />
										Floridablanca, Santander, Cordoba
									</span>
									<span className="provider-score">
										<span className="score-info">
											<b>score: </b>4.55
										</span>
										<span className="score-review">
											236 reviews <StarRating rating={5} />
										</span>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="provider-content">
					<ProviderSidebar />
					<div className="provider-main-content">
						<AboutProvider />
					</div>
				</div>
			</section>
			<section className="right">
				<ProviderList />
			</section>
		</main>
	);
};
