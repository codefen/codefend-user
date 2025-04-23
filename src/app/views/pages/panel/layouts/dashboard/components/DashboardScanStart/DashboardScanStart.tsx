import { useScanProgress } from '@hooks/useScanProgress';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import css from './dashscanstart.module.scss';

export const DashboardScanStart = () => {
  const { initialDomain } = useWelcomeStore();
  const { progress } = useScanProgress();

  return (
    <div className={css['scan-start']}>
      <h2>Escaneo en curso</h2>
      <p>
        Los escaners automaticos estan analizando uno de sus recursos web:{' '}
        <strong>{initialDomain}</strong>{' '}
      </p>
      <div className={css['scan-start-progress']}>
        <div className={css['scan-start-progress-bar']} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};
