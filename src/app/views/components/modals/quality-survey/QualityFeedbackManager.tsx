import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedbckInitial } from './QualityFeedbckInitial';
import { QualityFeedbackOverall } from './layouts/QualityFeedbackOverall';
import { QualityFeedbackTechCapabilities } from './layouts/QualityFeedbackTechCapabilities';
import './qualitysurvey.scss';
import { QualityFeedbackReporting } from './layouts/QualityFeedbackReporting';
import { QualityFeedbackTechSupport } from './layouts/QualityFeedbackTechSupport';
import { QualityFeedbackFinding } from './layouts/QualityFeedbackFinding';
import { QualityFeedbackComunication } from './layouts/QualityFeedbackComunication';
import { QualityFeedbackMessage } from './layouts/QualityFeedbackMessage';

export const QualityFeedbackManager = () => {
	const { isOpen, activePhase, provider, updatePhase, updateIsOpen } =
		useQualitySurveyStore();

	if (activePhase === QualitySurveyPhase.INIT) {
		return (
			<QualityFeedbckInitial
				isActive={isOpen}
				name={provider.name}
				onClose={() => updateIsOpen(false)}
				onNext={() => updatePhase(QualitySurveyPhase.OVERALL)}
			/>
		);
	}
	if (activePhase === QualitySurveyPhase.OVERALL) {
		return <QualityFeedbackOverall />;
	}
	if (activePhase === QualitySurveyPhase.TECH_CAPABILITIES) {
		return <QualityFeedbackTechCapabilities />;
	}
	if (activePhase === QualitySurveyPhase.REPORTING) {
		return <QualityFeedbackReporting />;
	}
	if (activePhase === QualitySurveyPhase.TECH_SUPPORT) {
		return <QualityFeedbackTechSupport />;
	}
	if (activePhase === QualitySurveyPhase.FINDING) {
		return <QualityFeedbackFinding />;
	}
	if (activePhase === QualitySurveyPhase.COMMUNICATION) {
		return <QualityFeedbackComunication />;
	}
	if (activePhase === QualitySurveyPhase.MESSAGE) {
		return <QualityFeedbackMessage />;
	}

	return undefined;
};
