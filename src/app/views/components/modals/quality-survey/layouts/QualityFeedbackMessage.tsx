import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualityMessage } from '@hooks/quality-survey/useQualityMessage';

export const QualityFeedbackMessage = () => {
  const { isOpen, provider, updatePhase, message, updateMessage } = useQualitySurveyStore();
  const sendMessage = useQualityMessage();

  const placeHolderText = `Please kindly provide a brief description of your experience with ${provider.name}. This information is very important for the professional reputation and will be visible to others customers.`;
  return (
    <QualityFeedback
      isFinish
      isActive={isOpen}
      onClose={() => {
        updatePhase(QualitySurveyPhase.REVOKE);
        sendMessage('');
      }}
      onNext={() => {
        updatePhase(QualitySurveyPhase.REVOKE);
        sendMessage(message);
      }}
      providerImg={`data:image/png;base64,${provider.profile_media}`}
      name={`${provider.fname} ${provider.lname}`}
      username={provider.username}
      desc={provider.headline}
      reviews="186"
      score="4.55"
      specialist="web"
      title="Would you like to add a professional recommendation for Edd?"
      question="">
      <div className="quality-poll">
        <textarea
          className="text-area-input log-inputs2"
          name="message"
          value={message}
          placeholder={placeHolderText}
          onChange={e => updateMessage(e.target.value)}
          id="quality-review"
          maxLength={255}
          cols={30}
          rows={5}></textarea>
      </div>
    </QualityFeedback>
  );
};
