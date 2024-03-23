import {
	PageLoader,
	PreviousMessage,
	PrimaryButton,
	Show,
	SimpleSection,
} from '../../../../../../views/components';
import { type FC } from 'react';

interface LoadingComponentProps {
	isLoading?: boolean;
}

const SnPreviousSearches: FC<LoadingComponentProps> = (props) => {
	return (
		<>
			<div className="previous-search">
				<div className="card table sns">
					<SimpleSection
						header="Previous Searches"
						icon={<PreviousMessage />}>
						<>
							<div className="columns-name">
								<div className="column">username</div>
								<div className="column">search</div>
							</div>

							<div className="rows internal-tables ">
								<Show when={!props.isLoading} fallback={<PageLoader />}>
									<div className="item-wrapper  text-format">
										<section className="search-item">
											<p className="name">nacho</p>
											<p className="result">codefend.com</p>
										</section>
									</div>
								</Show>
							</div>
						</>
					</SimpleSection>
				</div>

				<PrimaryButton
					text="REQUEST PROFESSIONAL ASSISTANCE"
					className="primary-full"
					click={() => alert('Processing your order')}
				/>
			</div>
		</>
	);
};

export default SnPreviousSearches;
