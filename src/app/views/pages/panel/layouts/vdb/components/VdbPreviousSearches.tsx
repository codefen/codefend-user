import { type FC } from 'react';
import { PrimaryButton } from '../../../../../components';

export const VdbPreviousSearches: FC = () => {
	return (
		<div className="previous-search-container">
			<div className="previous-search-wrapper">
				<div className="previous-search internal-tables">
					<div className="previous-search-header">
						<p className="text-small title-format">PREVIOUS SEARCHES</p>
					</div>
					<div className="previous-search-content">
						<div className="content-wrapper">
							<div className="content-header text-format">
								<section className="content-wrapper extend">
									<p>username:</p>
									<p>search</p>
								</section>
							</div>
							<div className="content-main text-format">
								<section className="content-wrapper extend">
									<p>nacho</p>
									<p>codefend.com</p>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>

			<PrimaryButton
				text="REQUEST PROFESSIONAL ASSISTANCE"
				click={(e: any) => alert('Processing your order')}
				className="primary-full"
			/>
		</div>
	);
};
