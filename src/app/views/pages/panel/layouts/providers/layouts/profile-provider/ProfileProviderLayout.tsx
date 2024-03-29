import { useParams } from 'react-router';
import { useProviderSidebar } from '../../../../../../../data';
import './aboutprovider.scss';
import { useEffect } from 'react';

export const ProfileProviderLayout = () => {
	const { view } = useParams();
	const { activeSubOption, setActiveSubOption } = useProviderSidebar();
	useEffect(() => {
		if (view) {
			if (view.startsWith('about')) {
				setActiveSubOption(0);
			}
			if (view.startsWith('order')) {
				setActiveSubOption(1);
			}
		}
	});

	if (activeSubOption === 0) {
		return (
			<div className="provider-about">
				<div className="about-header">
					<h2>About me:</h2>
				</div>

				<div className="about-provider">
					<p>
						<b>
							I love hacking, discovering things. I enjoy learning and
							spending time with people.
						</b>{' '}
						The more the better i have been involved in{' '}
						<b>cross-cultural work environments</b> for over 10 years and
						have led teams to find solutions and secure organizations. I
						realy enjoy teamwork and helping orhers. I am{' '}
						<b>an empathetic and kind person.</b>
					</p>
					<p>
						On the Myers-Briggs type indicator after a few years of
						marrlage and a few months of being a parent it seems that i
						tend towards ENFP, was ESFP before. I consider myself{' '}
						<b>a full-time learner in technical and social subjects.</b>
					</p>
					<p>
						I am an{' '}
						<b>
							information security researcher with an extensive career
						</b>{' '}
						of more than 10 years. I have public recognitions for
						reporting vulnerabilities to some major organizations like
						CERN, US Department of State.{' '}
						<b>US Department of Health and Human Services</b> and a few
						others from international private responsible disclosure
						programs and bug bounty.
					</p>

					<ul>
						<li>
							<span>U.S Department of State</span>
						</li>
						<li>
							<span>
								U.S Department of Health and Human Services(HHS)
							</span>
						</li>
						<li>
							<span>CERN (European Council for Nuclear Research)</span>
						</li>
					</ul>

					<p>
						I would love to
						<b>
							more to another country and live in a transcultural city ;)
						</b>
					</p>
				</div>
			</div>
		);
	}

	return undefined;
};
