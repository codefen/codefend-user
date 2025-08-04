import { SparklesIcon, LanIcon } from '@icons';
import { useTheme } from '@/app/views/context/ThemeContext';

export const WelcomeFinishSkeleton = () => {
  const { theme } = useTheme();

  return (
    <div className="welcome-finish-skeleton">
      {/* Header con logo */}
      <img className="logose" src={`/codefend/brand-small-${theme}.png`} width={120} />
      
      {/* Información del scan header */}
      <div className="scan-header-info">
        <div className="scan-header-row">
          <div className="scan-basic-info">
            <div className="skeleton-text skeleton-scan-info"></div>
          </div>
          <div className="progress-mini">
            <div className="skeleton-progress-circle"></div>
          </div>
        </div>
      </div>

      {/* AI based web scan */}
      <div className="card card-process">
        <div className="over">
          <div className="card-process-header">
            <div className="card-process-header-title">
              <SparklesIcon className="codefend-text-red" />
              <h3>AI based web scan</h3>
            </div>
            <div className="process-badge">
              <div className="skeleton-badge"></div>
            </div>
          </div>

          <div className="card-process-content">
            <div className="card-process-content-info">
              <div className="card-process-content-info-container">
                <div className="info-item">
                  <span>Started:</span>
                  <div className="skeleton-text skeleton-time"></div>
                </div>
                <div className="info-item">
                  <span>Detected issues:</span>
                  <div className="skeleton-text skeleton-number"></div>
                </div>
                <div className="info-item">
                  <span>Analyzed issues:</span>
                  <div className="skeleton-text skeleton-number"></div>
                </div>
              </div>
            </div>
            <div className="card-process-content-progress">
              <div className="progress-info">
                <div className="skeleton-progress-bar"></div>
                <div className="skeleton-text skeleton-percentage"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attack surface discovery */}
      <div className="card card-process">
        <div className="over">
          <div className="card-process-header">
            <div className="card-process-header-title">
              <LanIcon className="codefend-text-red" />
              <h3>Attack surface discovery</h3>
            </div>
            <div className="process-badge">
              <div className="skeleton-badge"></div>
            </div>
          </div>

          <div className="card-process-content">
            <div className="card-process-content-info">
              <div className="card-process-content-info-container">
                <div className="info-item">
                  <span>Started:</span>
                  <div className="skeleton-text skeleton-time"></div>
                </div>
                <div className="info-item">
                  <span>Subdomains found:</span>
                  <div className="skeleton-text skeleton-number"></div>
                </div>
                <div className="info-item">
                  <span>Detected servers:</span>
                  <div className="skeleton-text skeleton-number"></div>
                </div>
              </div>
            </div>
            <div className="card-process-content-progress">
              <div className="progress-info">
                <div className="skeleton-progress-bar"></div>
                <div className="skeleton-text skeleton-percentage"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Darkweb leaks research */}
      <div className="card card-process">
        <div className="over">
          <div className="card-process-header">
            <div className="card-process-header-title">
              <img
                src="/codefend/gota.png"
                alt="Drop Icon"
                className="codefend-text-red"
                style={{
                  width: '0.8em',
                  height: 'auto',
                  objectFit: 'contain',
                  marginRight: '0.2em',
                }}
              />
              <h3>Darkweb leaks research</h3>
            </div>
            <div className="process-badge">
              <div className="skeleton-badge"></div>
            </div>
          </div>

          <div className="card-process-content">
            <div className="card-process-content-info">
              <div className="card-process-content-info-container">
                <div className="info-item">
                  <span>Started:</span>
                  <div className="skeleton-text skeleton-time"></div>
                </div>
                <div className="info-item">
                  <span>Leaks found:</span>
                  <div className="skeleton-text skeleton-number"></div>
                </div>
                <div className="info-item">
                  <span>Social leaks:</span>
                  <div className="skeleton-text skeleton-number"></div>
                </div>
              </div>
            </div>
            <div className="card-process-content-progress">
              <div className="progress-info">
                <div className="skeleton-progress-bar"></div>
                <div className="skeleton-text skeleton-percentage"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};