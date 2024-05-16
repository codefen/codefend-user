import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedback } from '../QualityFeedback';
import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useUserRevoke } from '#commonUserHooks/useUserRevoke';

export const QualityFeedbackRevokeAccess = () => {
	const {
		isOpen,
		provider,
		updatePhase,
		updateIsOpen,
		updatePollVal,
		updateIsFinishQualityPoll,
		isFinishQualityPoll,
		pollVal,
	} = useQualitySurveyStore();
	const { revokeAccessUser } = useUserRevoke();
	const onNext = () => {
		updateIsOpen(false);
		updatePhase(QualitySurveyPhase.INIT);
		updateIsFinishQualityPoll(!isFinishQualityPoll);
		if (pollVal == '1') {
			revokeAccessUser(provider.id);
		}
	};
	return (
		<QualityFeedback
			isRevoke
			isActive={isOpen}
			onClose={onNext}
			onNext={onNext}
			providerImg={`data:image/png;base64,${provider.profile_media}`}
			name={`${provider.fname} ${provider.lname}`}
			username={provider.username}
			desc={provider.headline}
			reviews="186"
			score="4.55"
			specialist="web"
			title="Would you like to revoke user access now?"
			question="As the pentest has been finish, you can now remove the user access to your resources. Warning: once the access is remove this user will not longer be able to interact with the published issues or provide you assistance.">
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
					Yes, remove access now.
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
					No, I'll remove access manually once we fix our issues.
				</label>
			</div>
		</QualityFeedback>
	);
};
