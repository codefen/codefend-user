import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityMessage } from '@hooks/quality-survey/useQualityMessage';

export const QualityFeedbackMessage = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		message,
		updateMessage,
		updateIsFinishQualityPoll,
	} = useQualitySurveyStore();
	const sendMessage = useQualityMessage();

	const placeHolderText = `Please kindly provide a brief description of your experience with ${provider.name}. This information is very important for the professional reputation and will be visible to others customers.`;
	return (
		<QualityFeedback
			isFinish
			isActive={isOpen}
			onClose={() => {
				updateIsOpen(false);
				updatePhase(QualitySurveyPhase.INIT);
				sendMessage('');
				updateIsFinishQualityPoll(true);
			}}
			onNext={() => {
				updateIsOpen(false);
				updatePhase(QualitySurveyPhase.INIT);
				sendMessage(message);
				updateIsFinishQualityPoll(true);
			}}
			providerImg={`data:image/png;base64,${provider.profile_media}`}
			name={`${provider.fname} ${provider.lname}`}
			username={provider.username}
			desc={'Allow hackers to place their own description here.'}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Would you like to add a profesional recommendation for Edd?"
			question="">
			<div className="quality-poll">
				<textarea
					name="message"
					value={message}
					placeholder={placeHolderText}
					onChange={(e) => updateMessage(e.target.value)}
					id="quality-review"
					maxLength={255}
					cols={30}
					rows={5}></textarea>
			</div>
		</QualityFeedback>
	);
};
