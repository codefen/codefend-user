import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../..';

type TeamSizeProps = {
	setActiveTab: Function;
};

type OptionType = 'small' | 'medium' | 'full';

const TeamSize = (props: TeamSizeProps) => {
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(
		'small',
	);

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

			<div className="button-wrapper mt-6 flex justify-end gap-x-4">
				<div className="bg-blue-600 w-[25%]">
					<SecondaryButton
						text="back"
						click={(e: any) => {
							props.setActiveTab('frequency');
						}}
						className=" codefend_secondary_ac w-full"
					/>
				</div>
				<div className="bg-yellow-500 w-2/6">
					<PrimaryButton
						text="Continue to the next step"
						click={() => {
							props.setActiveTab('order review');
						}}
						className=" codefend_main_ac w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default TeamSize;
