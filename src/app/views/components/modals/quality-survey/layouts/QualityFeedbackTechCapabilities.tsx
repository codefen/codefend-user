import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityTechCapabilities } from '@hooks/quality-survey/useQualityTechCapabilities';

export const QualityFeedbackTechCapabilities = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		pollVal,
	} = useQualitySurveyStore();
	const sendIssueRelevance = useQualityTechCapabilities();
	return (
		<QualityFeedback
			isActive={isOpen}
			onClose={() => {
				updateIsOpen(false);
				updatePhase(QualitySurveyPhase.INIT);
			}}
			onNext={() => {
				updatePhase(QualitySurveyPhase.REPORTING);
				sendIssueRelevance(pollVal);
			}}
			providerImg={`data:image/png;base64,${provider.profile_media}`}
			name={`${provider.fname} ${provider.lname}`}
			username={provider.username}
			desc={'Allow hackers to place their own description here.'}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Technical Capabilities:"
			question="Were you satisfied with the quality of the technical findings provided?">
			<div className="quality-poll">
				<label>
					<input
						type="radio"
						name="techCapabilitiesVal"
						className="radio-option"
						onChange={(e) => updatePollVal('1')}
						value="1"
						required
					/>
					<div className="codefend-radio"></div>
					1: Not relevant or usefull.
				</label>
				<label>
					<input
						type="radio"
						name="techCapabilitiesVal"
						className="radio-option"
						onChange={(e) => updatePollVal('2')}
						value="2"
						required
					/>
					<div className="codefend-radio"></div>
					2: Slightly relevant but generally underwhelming.
				</label>
				<label>
					<input
						type="radio"
						name="techCapabilitiesVal"
						className="radio-option"
						onChange={(e) => updatePollVal('3')}
						defaultChecked
						value="3"
						required
					/>
					<div className="codefend-radio"></div>
					3: Moderately relevant and useful.
				</label>
				<label>
					<input
						type="radio"
						name="techCapabilitiesVal"
						className="radio-option"
						onChange={(e) => updatePollVal('4')}
						value="4"
						required
					/>
					<div className="codefend-radio"></div>
					4: Very relevant and helpful.
				</label>
				<label>
					<input
						type="radio"
						name="techCapabilitiesVal"
						className="radio-option"
						onChange={(e) => updatePollVal('5')}
						value="5"
						required
					/>
					<div className="codefend-radio"></div>
					5: Extremely relevant and instrumental in enhancing security.
				</label>
			</div>
		</QualityFeedback>
	);
};
