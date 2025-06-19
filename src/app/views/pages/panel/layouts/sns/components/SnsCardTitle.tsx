import type { FC } from 'react';
import { GlobeWebIcon } from '@icons';
import './SnsCardTitle.scss';

interface SnsCardTitleProps {
  arrow?: 'down' | 'up' | 'none';
  align?: 'left' | 'center';
  title?: string; // Nuevo: permite personalizar el título
  description?: string; // Nuevo: permite personalizar la descripción
}

const SnsCardTitle: FC<SnsCardTitleProps> = ({
  arrow = 'down',
  align = 'center',
  title = 'Dataleaks search',
  description = 'Search our dataleaks databases to see if there is leaked information about your users or company.',
}) => {
  const isUp = arrow === 'up';
  const isDown = arrow === 'down';
  const alignItems = align === 'left' ? 'flex-start' : 'center';
  return (
    <>
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
          width: align === 'left' ? '80%' : '100%',
        }}>
        <div className="header">
          <img
            src="codefend/gota.png"
            alt="Globe Icon"
            style={{ width: '18px', height: '24px', marginRight: '8px' }}
          />
          <span style={{ verticalAlign: 'middle' }}>{title}</span>
        </div>
        <div className="content">
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

export default SnsCardTitle;
