import React, { useMemo, useState } from 'react';
import {
	PageLoader,
	PreviousMessage,
	PrimaryButton,
	Show,
	SimpleSection,
} from '../../../../../components';
import { PreviousSearch, generateIDArray } from '../../../../../../data';

interface InxPreviousSearchesProps {
	isLoading: boolean;
	previousSearches: PreviousSearch[];
}

export const InxPreviousSearches: React.FC<InxPreviousSearchesProps> = ({
	isLoading,
	previousSearches,
}) => {
	const safelyPreviousSearches = () =>
		Array.isArray(previousSearches) ? previousSearches.reverse() : [];

	const previusKeys = generateIDArray(safelyPreviousSearches().length);

	return (
		<>
			<div className="previous-search">
				<div className="card table inx">
					<SimpleSection
						header="Previous Searches"
						icon={<PreviousMessage />}>
						<>
							<div className="columns-name">
								<div className="column">username</div>
								<div className="column">search</div>
							</div>

							<div className="rows internal-tables ">
								<Show when={!isLoading} fallback={<PageLoader />}>
									<>
										{safelyPreviousSearches().map(
											(searchData: PreviousSearch, i: number) => (
												<div
													className="item-wrapper"
													key={previusKeys[i]}>
													<section className="search-item">
														<p className="name">
															{searchData.username}
														</p>
														<p className="result">
															{searchData.info.split(
																'queries:',
															)[1] ?? '--'}
														</p>
													</section>
												</div>
											),
										)}
									</>
								</Show>
							</div>
						</>
					</SimpleSection>
				</div>
				<PrimaryButton
					text="REQUEST PROFESSIONAL ASSISTANCE"
					click={() => {
						alert('Processing your order');
					}}
					className="primary-full"
				/>
			</div>
		</>
	);
};
