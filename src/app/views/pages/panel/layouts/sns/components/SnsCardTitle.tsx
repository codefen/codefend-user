import type { FC } from 'react';
import { GlobeWebIcon } from '@icons';

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
          <GlobeWebIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
          <span style={{ verticalAlign: 'middle' }}>Dataleaks search</span>
        </div>
        <div className="content">
          <p>
            Search our dataleaks databases to see if there is leaked information about your users or
            company.
          </p>
        </div>
      </div>
      <style>{`
        .bouncing-dots-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .bouncing-dots-arrow .dot {
          width: 10px;
          height: 10px;
          background: #ec2603;
          border-radius: 50%;
          margin: 4px 0;
          animation: dot-bounce 1.2s infinite;
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(18px); }
        }
        .bouncing-dots-arrow .arrow-head {
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 20px solid #ec2603;
          background: none;
          filter: none;
          margin-bottom: 2px;
          animation: dot-bounce 1.2s infinite;
        }
        .bouncing-dots-arrow[style*="rotate(180deg)"] .arrow-head {
          border-bottom: none;
          border-top: 20px solid #ec2603;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          margin-bottom: 0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default SnsCardTitle;
