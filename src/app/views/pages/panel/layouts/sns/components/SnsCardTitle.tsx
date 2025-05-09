import type { FC } from 'react';
import { GlobeWebIcon } from '@icons';
import './SnsCardTitle.scss';

interface SnsCardTitleProps {
  arrow?: 'down' | 'up' | 'none';
  align?: 'left' | 'center';
}

const SnsCardTitle: FC<SnsCardTitleProps> = ({ arrow = 'down', align = 'center' }) => {
  const isUp = arrow === 'up';
  const isDown = arrow === 'down';
  const alignItems = align === 'left' ? 'flex-start' : 'center';
  return (
    <div>
      {/* Flecha animada de puntitos */}
      {arrow !== 'none' && (
        <div
          style={{
            height: 80,
            display: 'flex',
            alignItems: isUp
              ? align === 'left'
                ? 'flex-start'
                : 'flex-start'
              : align === 'left'
                ? 'flex-start'
                : 'flex-end',
            justifyContent: align === 'left' ? 'flex-start' : 'center',
            marginBottom: align === 'center' ? 32 : 0,
            marginTop: isUp ? 32 : 0,
          }}>
          <div className="bouncing-dots-arrow" style={isUp ? { transform: 'rotate(180deg)' } : {}}>
            {isUp ? (
              <>
                <span className="arrow-head" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </>
            ) : (
              <>
                <span className="arrow-head" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </>
            )}
          </div>
        </div>
      )}
      <div
        className="card title"
        style={{
          marginBottom: '1.2rem',
          width: align === 'left' ? '80%' : '100%',
          maxWidth: 540,
          marginLeft: 0,
          marginRight: 0,
        }}>
        <div className="header">
          <GlobeWebIcon />
          <span style={{ verticalAlign: 'middle' }}>Dataleaks search</span>
        </div>
        <div className="content">
          <p>
            Search our dataleaks databases to see if there is leaked information about your users or
            company.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnsCardTitle;
