import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { Show } from '../../..';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityCommunication } from '@hooks/quality-survey/useQualityCommunication';

export const QualityFeedbackComunication = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		pollVal,
	} = useQualitySurveyStore();
	const sendCommunication = useQualityCommunication();
	return (
		<QualityFeedback
			isActive={isOpen}
			onClose={() => updateIsOpen(false)}
			onNext={() => {
				updatePhase(QualitySurveyPhase.MESSAGE);
				sendCommunication(pollVal);
			}}
			providerImg="/util/default-profilemedia.webp"
			name={'Edd krause'}
			username={'edd'}
			desc={'Allow hackers to place their own description here.'}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Timeliness and Communication:"
			question="How would you rate the timeliness and effectiveness of communication from our professional?">
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
					1: Significantly delayed and poor communication.
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
					2: Somewhat delayed or ineffective communication.
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
					3: Adequote timing and comunication.
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
					4: Timely and effective communication.
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
					5: Exceptionally prompt and highly effective communication.
				</label>
			</div>
		</QualityFeedback>
	);
};
