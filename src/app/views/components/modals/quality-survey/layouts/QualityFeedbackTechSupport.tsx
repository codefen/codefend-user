import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityTechSupport } from '@hooks/quality-survey/useQualityTechSupport';

export const QualityFeedbackTechSupport = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		pollVal,
	} = useQualitySurveyStore();
	const sendTechSupport = useQualityTechSupport();
	return (
		<QualityFeedback
			isActive={isOpen}
			onClose={() => updateIsOpen(false)}
			onNext={() => {
				updatePhase(QualitySurveyPhase.FINDING);
				sendTechSupport(pollVal);
			}}
			providerImg="/util/default-profilemedia.webp"
			name={'Edd krause'}
			username={'edd'}
			desc={'Allow hackers to place their own description here.'}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Technical Support for Vulnerabilities:"
			question="How would you rate the assistance provided addressing vulnerabilities?">
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
					1: No assistance received.
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
					2: Poor response, not helpful.
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
					3: Adequote assistance and support.
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
					4: Very good support and helpful responses.
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
					5: Excellent, timely, and highly effective support.
				</label>
			</div>
		</QualityFeedback>
	);
};
