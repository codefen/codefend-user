import { ScanSearchIcon } from '@icons';

export const ScanTitle = () => {
  return (
    <div className="card title">
      <div className="header">
        <ScanSearchIcon />
        <span>Automatic scans</span>
      </div>
      <div className="content">
        <p>Performs automatic scans with artificial intelligence</p>
      </div>
    </div>
  );
};
