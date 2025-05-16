import { ScanSearchIcon } from '@icons';

export const ScanTitle = () => {
  return (
    <div className="card title">
      <div className="header">
        <ScanSearchIcon />
        <span>Automatic scans</span>
      </div>
      <div className="content">
        <p>
          Perform automated security testing on your web applications using our AI-powered scanners.
        </p>
      </div>
    </div>
  );
};
