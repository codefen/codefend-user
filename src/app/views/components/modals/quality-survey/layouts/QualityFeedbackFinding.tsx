import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityFinding } from '@hooks/quality-survey/useQualityFinding';

export const QualityFeedbackFinding = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		pollVal,
	} = useQualitySurveyStore();
	const sendOverallPhase = useQualityFinding();
	return (
		<QualityFeedback
			isActive={isOpen}
			onClose={() => updateIsOpen(false)}
			onNext={() => {
				updatePhase(QualitySurveyPhase.COMMUNICATION);
				sendOverallPhase(pollVal);
			}}
			providerImg="/util/default-profilemedia.webp"
			name={'Edd krause'}
			username={'edd'}
			desc={'Allow hackers to place their own description here.'}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Number of Findings:"
			question="How satisfied were you with the number of findings reported by the specialist?">
			<div className="quality-poll">
				<label>
					<input
						type="radio"
						name="communicationVal"
						className="radio-option"
						onChange={(e) => updatePollVal('1')}
						value="1"
						required
					/>
					<div className="codefend-radio"></div>
					1: Far fewer than expected.
				</label>
				<label>
					<input
						type="radio"
						name="communicationVal"
						className="radio-option"
						onChange={(e) => updatePollVal('2')}
						value="2"
						required
					/>
					<div className="codefend-radio"></div>
					2: Fewer than expected.
				</label>
				<label>
					<input
						type="radio"
						name="communicationVal"
						className="radio-option"
						onChange={(e) => updatePollVal('3')}
						value="3"
						defaultChecked
						required
					/>
					<div className="codefend-radio"></div>
					3: As expected.
				</label>
				<label>
					<input
						type="radio"
						name="communicationVal"
						className="radio-option"
						onChange={(e) => updatePollVal('4')}
						value="4"
						required
					/>
					<div className="codefend-radio"></div>
					4: More than expected.
				</label>
				<label>
					<input
						type="radio"
						name="communicationVal"
						className="radio-option"
						onChange={(e) => updatePollVal('5')}
						value="5"
						required
					/>
					<div className="codefend-radio"></div>
					5: Surpassed expectations with extensive findings.
				</label>
			</div>
		</QualityFeedback>
	);
};
