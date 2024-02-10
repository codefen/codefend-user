import React, { useState } from 'react';

type TeamSizeProps = {
	setActiveTab: Function;
};

type OptionType = 'small' | 'medium' | 'full';

const TeamSize = (props: TeamSizeProps) => {
	const [selectedOption, setSelectedOption] = useState<any>(null);

	const handleSelectedOption = (option: OptionType) => {
		if (option === selectedOption) return;
		if (option === 'small') {
			setSelectedOption('small');
		} else if (option === 'medium') {
			setSelectedOption('medium');
		} else if (option === 'full') {
			setSelectedOption('full');
		} else {
			setSelectedOption(null);
		}
	};

	const isOptionSelected = (option: OptionType) => selectedOption === option;

	return (
		<div>
			<div className="option-header">
				<h1>
					Vamos a dimensionar la tarea, por favor seleccione el modelo.
				</h1>
				<span>
					A continuación puede ver diversas opciones que nos ayudaran a
					personalizar su experiencia:
				</span>
			</div>

			<div className="scope-content">
				<div
					className={`option show-border cursor-pointer ${
						isOptionSelected('small') && `selected`
					}`}
					onClick={() => {
						handleSelectedOption('small');
					}}>
					<h2>$1,500</h2>

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color">Small allocation:</span>
						</div>
						<span className="text-[#9b9a9a]">
							un equipo multidiciplinario de hackers profesionales
							revisando exclusivamente su caso.
						</span>
					</div>
				</div>
				<div
					className={`option  bottom-border cursor-pointer ${
						isOptionSelected('medium') && `selected`
					}`}
					onClick={() => {
						handleSelectedOption('medium');
					}}>
					<h2>$4,500</h2>

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color"> Medium allocation:</span>
						</div>
						<span className="text-[#9b9a9a]">
							un equipo multidiciplinario de hackers profesionales
							revisando exclusivamente su caso.
						</span>
					</div>
				</div>
				<div
					className={`option  bottom-border cursor-pointer ${
						isOptionSelected('full') && `selected`
					}`}
					onClick={() => {
						handleSelectedOption('full');
					}}>
					<h2>$13,500</h2>

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color">
								Full team allocation:
							</span>
						</div>
						<span className="text-[#9b9a9a]">
							un equipo multidiciplinario de hackers profesionales
							revisando exclusivamente su caso.
						</span>
					</div>
				</div>
			</div>
			{/* <div className="mt-20 flex items-center gap-x-2 show-border  px-10">
        <input type="checkbox" alt="checkbox" className="" />
        <span className="codefend-color">I confirm I have authorization</span>
        <span className="text-black">and I’ve read and accept the disclaimer.</span>
      </div> */}
			<div className="button-wrapper mt-20 flex justify-end">
				<button
					// type="button"
					// disabled={isDeletingResource()}
					onClick={() => {
						props.setActiveTab('frequency');
					}}
					className="log-inputs text-gray focus:outline-none w-2/6 px-4 mr-2 py-3 text-sm tracking-wide text-white transition-colors duration-300">
					back
				</button>
				<button
					onClick={() => {
						props.setActiveTab('order review');
					}}
					// type="submit"
					// disabled={isDeletingResource()}
					className="log-inputs flex items-center gap-x-2 text-white focus:outline-none bg-codefend px-6 w-2.5/6 py-3 text-sm transition-colors tracking-wide duration-300 font-400 text-">
					{/* {(props.isDeleting || isDeletingResource()) && <ButtonLoader />} */}
					Continue to the next step
				</button>
			</div>
		</div>
	);
};

export default TeamSize;
