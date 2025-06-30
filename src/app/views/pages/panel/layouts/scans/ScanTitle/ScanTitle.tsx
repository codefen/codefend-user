import { ScanSearchIcon } from '@icons';
import { useLocation } from 'react-router-dom';

export const ScanTitle = () => {
  const location = useLocation();
  
  const isUnifiedRoute = location.pathname.startsWith('/ai-surveillance');
  const isLegacyWebSurveillance = location.pathname.startsWith('/web-surveillance');

  const getTitle = () => {
    if (isUnifiedRoute) return 'AI Surveillance';
    if (isLegacyWebSurveillance) return 'Web surveillance';
    return 'Automatic scans';
  };

  const getDescription = () => {
    if (isUnifiedRoute) {
      return 'Comprehensive AI-powered security analysis combining automated scans and continuous surveillance of your web applications.';
    }
    if (isLegacyWebSurveillance) {
      return 'Monitor and track the security status of your web applications with continuous surveillance and historical analysis.';
    }
    return 'Perform automated security testing on your web applications using our AI-powered scanners.';
  };

  return (
    <div className="card title">
      <div className="header">
        <ScanSearchIcon />
        <span>{getTitle()}</span>
      </div>
      <div className="content">
        <p>{getDescription()}</p>
      </div>
    </div>
  );
};
