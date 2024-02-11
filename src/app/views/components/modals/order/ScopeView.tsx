import { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../..';

type ScopeViewProps = {
	setActiveTab: Function;
	closeModal: Function;
};

type ScopeViewOption = 'team resources' | 'mobile resources';

const ScopeView = (props: ScopeViewProps) => {
	const [selectedOption, setSelectedOption] = useState<ScopeViewOption | null>(
		'mobile resources',
	);

	const handleSelectedOption = (option: ScopeViewOption) => {
		if (option === selectedOption) return;
		if (option === 'team resources') {
			setSelectedOption('team resources');
		} else if (option === 'mobile resources') {
			setSelectedOption('mobile resources');
		} else {
			setSelectedOption(null);
		}
	};

	const isOptionChecked = (option: ScopeViewOption) =>
		selectedOption === option;

	return (
		<div>
			<div className="option-header">
				<h1>Let's start a new pentest! what would like analyse?</h1>
				<span>Please select the assets that you would ike to scope</span>
			</div>
			<div className="scope-content">
				<div className="option show-border">
					<input
						id="mobile-resources"
						type="radio"
						className=""
						checked={isOptionChecked('mobile resources')}
						onChange={(value) => {
							handleSelectedOption('mobile resources');
						}}
					/>
					<label htmlFor="mobile-resources" className="flex flex-col">
						<div className="top">
							<p> I want to analyze all my team mobile resources</p>
							<span className="codefend-color ml-2">
								{' '}
								- 6 resources:
							</span>
						</div>
						<span className="text-[#9b9a9a]">
							This option allocates the resources exclusively on your
							mobile apps.
						</span>
					</label>
				</div>
				<div className="option bottom-border">
					<input
						id="team-resources"
						type="radio"
						className="log-inputs"
						checked={isOptionChecked('team resources')}
						onChange={(value) => {
							handleSelectedOption('team resources');
						}}
					/>
					<label htmlFor="team-resources" className="flex flex-col">
						<div className="top">
							<p> I want to analyze all my team resources</p>
							<span className="codefend-color ml-2">
								{' '}
								- 18 resources:
							</span>
						</div>
						<span className="text-[#9b9a9a]">
							This option allocates the resources in all the resources
							loaded in the app.
						</span>
					</label>
				</div>
			</div>
			<div className="mt-20 flex items-center gap-x-2 show-border  px-10">
				<input
					id="confirmation"
					type="checkbox"
					alt="checkbox"
					className="log-inputs"
				/>
				<label htmlFor="confirmation" className="flex items-center gap-x-1">
					<span className="codefend-color">
						I confirm I have authorization
					</span>
					<span className="text-black">
						and I’ve read and accept the disclaimer.
					</span>
				</label>
			</div>

			{/* <div className="button-wrapper mt-6 flex justify-end">
				<button
					// type="button"
					// disabled={isDeletingResource()}
					onClick={() => {
						props.closeModal();
					}}
					className="log-inputs text-gray focus:outline-none w-2/6 px-4 mr-2 py-3 text-sm tracking-wide text-white transition-colors duration-300">
					cancel
				</button>
				<button
					onClick={() => {
						props.setActiveTab('frequency');
					}}
					// type="submit"
					// disabled={isDeletingResource()}
					className="log-inputs flex items-center gap-x-2 text-white focus:outline-none bg-codefend px-6 w-2.5/6 py-3 text-sm transition-colors tracking-wide duration-300 font-400 text-">
					{(props.isDeleting || isDeletingResource()) && <ButtonLoader />}
					Continue to the next step
				</button>
			</div> */}
			<div className="button-wrapper mt-6 flex justify-end gap-x-4">
				<div className="bg-blue-600 w-[25%]">
					<SecondaryButton
						text="cancel"
						click={(e: any) => {
							props.closeModal();
						}}
						className=" codefend_secondary_ac w-full"
					/>
				</div>
				<div className="bg-yellow-500 w-2/6">
					<PrimaryButton
						text="Continue to the next step"
						click={() => {
							props.setActiveTab('frequency');
						}}
						className=" codefend_main_ac w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default ScopeView;
