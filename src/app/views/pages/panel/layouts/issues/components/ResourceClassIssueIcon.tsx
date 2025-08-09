import { CLoudIcon, MobileIcon, SourceCodeIcon, WebSolidIcon } from '@icons';

export const ResourceClassIssueIcon = ({ resourceClass }: { resourceClass: string }) => {
  const getIcon = () => {
    switch (resourceClass) {
      case 'web':
        return <WebSolidIcon />;
      case 'mobile':
        return <MobileIcon />;
      case 'cloud':
        return <CLoudIcon />;
      case 'source_code':
        return <SourceCodeIcon />;
      case 'leaks':
        return <img src="codefend/gota.png" alt="Globe Icon" style={{ width: '0.9em' }} />;
      default:
        return <WebSolidIcon />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e56060db',
        padding: '3px',
        borderRadius: '6px',
        minWidth: '20px',
        minHeight: '20px',
      }}>
      {getIcon()}
    </div>
  );
};
