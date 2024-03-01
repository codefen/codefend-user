import React from 'react';
import { PrimaryButton } from '../../../../../components';

export const VdbPreviousSearches: React.FC = () => {
	return (
		<div className="h-full flex flex-col ">
			<div className="h-[36%] overflow-hidden">
				<div className="w-full internal-tables h-full ">
					<div className="py-3 px-5  flex flex-row gap-x-3.5 ">
						<p className="text-small text-left font-bold title-format">
							PREVIOUS SEARCHES
						</p>
					</div>
					<div className="flex px-8 py-2 full-height overflow-auto ">
						<div className="w-full">
							<div className="flex p-3 text-format">
								<section className="flex w-full">
									<p className="text-base w-2/4">username:</p>
									<p className="text-base w-2/4">search</p>
								</section>
							</div>
							<div className="flex px-3 py-1 text-format">
								<section className="flex w-full">
									<p className="w-2/4">nacho</p>
									<p className="text-base w-2/4">codefend.com</p>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>

			<PrimaryButton
				text="REQUEST PROFESSIONAL ASSISTANCE"
				click={(e: any) => alert('Processing your order')}
				className="w-full mt-4"
			/>
		</div>
	);
};
