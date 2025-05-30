import { QualitySurveyPhase } from '@interfaces/quality-feedback';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import { QualityFeedbackInitial } from './QualityFeedbackInitial';
import { QualityFeedbackOverall } from './layouts/QualityFeedbackOverall';
import { QualityFeedbackTechCapabilities } from './layouts/QualityFeedbackTechCapabilities';
import './qualitysurvey.scss';
import { QualityFeedbackReporting } from './layouts/QualityFeedbackReporting';
import { QualityFeedbackTechSupport } from './layouts/QualityFeedbackTechSupport';
import { QualityFeedbackFinding } from './layouts/QualityFeedbackFinding';
import { QualityFeedbackCommunication } from './layouts/QualityFeedbackCommunication';
import { QualityFeedbackMessage } from './layouts/QualityFeedbackMessage';
import { QualityFeedbackRevokeAccess } from './layouts/QualityFeedbackRevokeAccess';

export const QualityFeedbackManager = () => {
  const { isOpen, activePhase, provider, updatePhase, updateIsOpen } = useQualitySurveyStore();

  if (activePhase === QualitySurveyPhase.INIT) {
    return (
      <QualityFeedbackInitial
        isActive={isOpen}
        name={provider.fname + ' ' + provider.lname}
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
    return <QualityFeedbackCommunication />;
  }
  if (activePhase === QualitySurveyPhase.MESSAGE) {
    return <QualityFeedbackMessage />;
  }
  if (activePhase === QualitySurveyPhase.REVOKE) {
    return <QualityFeedbackRevokeAccess />;
  }

  return undefined;
};
