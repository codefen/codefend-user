import React, { useState } from 'react';

type FrequencyViewProps = {
	setActiveTab: Function;
};

type FrequencyViewOption = 'permanent surveillance' | 'one snapshot';

const FrequencyView = (props: FrequencyViewProps) => {
	const [selectedOption, setSelectedOption] = useState<any>(null);

	const handleSelectedOption = (option: FrequencyViewOption) => {
		if (option === selectedOption) return;
		if (option === 'permanent surveillance') {
			setSelectedOption('permanent surveillance');
		} else if (option === 'one snapshot') {
			setSelectedOption('one snapshot');
		} else {
			setSelectedOption(null);
		}
	};

	const isOptionSelected = (option: FrequencyViewOption) =>
		selectedOption === option;

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
						isOptionSelected('one snapshot') && `selected`
					}`}
					onClick={() => {
						handleSelectedOption('one snapshot');
					}}>
					<img src="/codefend/order-frequency1.svg" alt="icon" />

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color">
								One “snapshot” pentest:
							</span>
							<p>
								recomendado para la revisión inicial de recursos antes
								de ser empleados, billed once.
							</p>
						</div>
						<span className="text-[#9b9a9a]">
							Se realizará un solo pentests + informe
						</span>
					</div>
				</div>
				<div
					className={`option  bottom-border cursor-pointer ${
						isOptionSelected('permanent surveillance') && `selected`
					}`}
					onClick={() => {
						handleSelectedOption('permanent surveillance');
					}}>
					<img src="/codefend/order-frequency2.svg" alt="icon" />

					<div className="flex flex-col">
						<div className="top">
							<span className="codefend-color">
								Permanent surveillance:
							</span>
							<p>
								recomendado para el monitoreo permanente recursos,
								billed monthly.
							</p>
						</div>
						<span className="text-[#9b9a9a]">
							Se realizará un máximo de 12 pentests anuales.
						</span>
					</div>
				</div>
			</div>

			<div className="button-wrapper mt-20 flex justify-end">
				<button
					// type="button"
					// disabled={isDeletingResource()}
					onClick={() => {
						props.setActiveTab('scope');
					}}
					className="log-inputs text-gray focus:outline-none w-2/6 px-4 mr-2 py-3 text-sm tracking-wide text-white transition-colors duration-300">
					back
				</button>
				<button
					onClick={() => {
						props.setActiveTab('team size');
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

export default FrequencyView;
