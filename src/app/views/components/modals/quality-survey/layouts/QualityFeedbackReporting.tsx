import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityReporting } from '@hooks/quality-survey/useQualityReporting';

export const QualityFeedbackReporting = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		pollVal,
	} = useQualitySurveyStore();
	const sendReporting = useQualityReporting();
	return (
		<QualityFeedback
			isActive={isOpen}
			onClose={() => {
				updateIsOpen(false);
				updatePhase(QualitySurveyPhase.INIT);
			}}
			onNext={() => {
				updatePhase(QualitySurveyPhase.TECH_SUPPORT);
				sendReporting(pollVal);
			}}
			providerImg={`data:image/png;base64,${provider.profile_media}`}
			name={`${provider.fname} ${provider.lname}`}
			username={provider.username}
			desc={provider.headline}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Reporting Capabilities:"
			question="Were the reported issues provided clear, easy to reproduce, and adequately detailed?">
			<div className="quality-poll">
				<label>
					<input
						type="radio"
						name="reportingVal"
						className="radio-option"
						onChange={(e) => updatePollVal('1')}
						value="1"
						required
					/>
					<div className="codefend-radio"></div>
					1: Unclear and not detailed.
				</label>
				<label>
					<input
						type="radio"
						name="reportingVal"
						className="radio-option"
						onChange={(e) => updatePollVal('2')}
						value="2"
						required
					/>
					<div className="codefend-radio"></div>
					2: Somewhat clear but lackingg in detail.
				</label>
				<label>
					<input
						type="radio"
						name="reportingVal"
						className="radio-option"
						onChange={(e) => updatePollVal('3')}
						value="3"
						defaultChecked
						required
					/>
					<div className="codefend-radio"></div>
					3: Clear with adequate detail.
				</label>
				<label>
					<input
						type="radio"
						name="reportingVal"
						className="radio-option"
						onChange={(e) => updatePollVal('4')}
						value="4"
						required
					/>
					<div className="codefend-radio"></div>
					4: Very clear and well-detailed.
				</label>
				<label>
					<input
						type="radio"
						name="reportingVal"
						className="radio-option"
						onChange={(e) => updatePollVal('5')}
						value="5"
						required
					/>
					<div className="codefend-radio"></div>
					5: Exceptionally clear, detailed, and well-documented.
				</label>
			</div>
		</QualityFeedback>
	);
};
