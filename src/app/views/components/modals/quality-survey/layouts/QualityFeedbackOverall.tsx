import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityOveralPhase } from '@hooks/quality-survey/useQualityOveralPhase';

export const QualityFeedbackOverall = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		pollVal,
	} = useQualitySurveyStore();
	const sendOverallPhase = useQualityOveralPhase();

	return (
		<QualityFeedback
			isActive={isOpen}
			onClose={() => {
				updateIsOpen(false);
				updatePhase(QualitySurveyPhase.INIT);
			}}
			onNext={() => {
				updatePhase(QualitySurveyPhase.TECH_CAPABILITIES);
				sendOverallPhase(pollVal);
			}}
			providerImg={`data:image/png;base64,${provider.profile_media}`}
			name={`${provider.fname} ${provider.lname}`}
			username={provider.username}
			desc={provider.headline}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Overall score:"
			question="How would you rate your overall satisfaction with the service provided by our profesional?">
			<div className="quality-poll">
				<label>
					<input
						type="radio"
						name="overralVal"
						className="radio-option"
						onChange={(e) => updatePollVal('1')}
						value="1"
						required
					/>
					<div className="codefend-radio"></div>
					1: Very Unsatisfied, i am not at all satisfied with the service
					received.
				</label>
				<label>
					<input
						type="radio"
						name="overralVal"
						className="radio-option"
						onChange={(e) => updatePollVal('2')}
						value="2"
						required
					/>
					<div className="codefend-radio"></div>
					2: Unsatisfied, i am not satisfied with the service received.
				</label>
				<label>
					<input
						type="radio"
						name="overralVal"
						className="radio-option"
						defaultChecked
						onChange={(e) => updatePollVal('3')}
						value="3"
						required
					/>
					<div className="codefend-radio"></div>
					3: Good.
				</label>
				<label>
					<input
						type="radio"
						name="overralVal"
						className="radio-option"
						onChange={(e) => updatePollVal('4')}
						value="4"
						required
					/>
					<div className="codefend-radio"></div>
					4: Very Good.
				</label>
				<label>
					<input
						type="radio"
						name="overralVal"
						className="radio-option"
						onChange={(e) => updatePollVal('5')}
						value="5"
						required
					/>
					<div className="codefend-radio"></div>
					5: Excellent.
				</label>
			</div>
		</QualityFeedback>
	);
};
