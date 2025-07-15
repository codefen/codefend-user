import { memo } from 'react';

interface ProjectionControlsProps {
  selectedProjection: string;
  onProjectionChange: (projection: string) => void;
  title?: string;
}

const ProjectionControls = memo<ProjectionControlsProps>(
  ({ selectedProjection, onProjectionChange, title = 'Global server distribution' }) => {
    return (
      <div className="header">
        <div className="title-section">
          <span>{title}</span>
          <div className="view-tabs">
            <span className="divider">|</span>
            <button
              className={selectedProjection === 'orthographicInteractive' ? 'active' : ''}
              onClick={() => onProjectionChange('orthographicInteractive')}>
              3D
            </button>
            <span className="divider">|</span>
            <button
              className={selectedProjection === 'naturalEarth1' ? 'active' : ''}
              onClick={() => onProjectionChange('naturalEarth1')}>
              2D
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ProjectionControls.displayName = 'ProjectionControls';

export default ProjectionControls;
