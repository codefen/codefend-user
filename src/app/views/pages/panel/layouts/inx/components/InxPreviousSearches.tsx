import React, { useMemo } from 'react';
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

	const previusKeys = useMemo(
		() =>
			Boolean(safelyPreviousSearches().length)
				? generateIDArray(safelyPreviousSearches().length)
				: [],
		[safelyPreviousSearches()],
	);

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
													className="flex px-3 py-1 text-format text-gray-400"
													key={previusKeys[i]}>
													<section className="flex w-full items-center">
														<p className="w-2/4">
															{searchData.username}
														</p>
														<p className="text-base w-2/4">
															{searchData.info.split("queries:")[1] ?? "--"}
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
					className="w-full mt-4"
				/>
			</div>
		</>
	);
};
