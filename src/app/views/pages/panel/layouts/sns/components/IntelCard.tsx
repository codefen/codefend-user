import { type FC } from 'react';
import type { IntelData } from '../../../../../../data/interfaces/snsTypes';

interface IntelCardProps {
  intel: IntelData;
  onOpenLeakedModal: (leaked: any, type: 'crack' | 'geo') => void;
}

export const IntelCard: FC<IntelCardProps> = ({ intel, onOpenLeakedModal }) => {
  const formatName = (name: string) => {
    return (
      name
        .replace(/_\d+[MK]$/, '')
        .charAt(0)
        .toUpperCase() +
      name
        .replace(/_\d+[MK]$/, '')
        .slice(1)
        .toLowerCase()
    );
  };

  return (
    <div className="search-result">
      <div className="header">
        <div className="title">{intel?.name ? formatName(intel.name) : ''}</div>
      </div>
      <div className="info">
        {intel?.value.map((subIntel, subIndex) => (
          <div
            key={subIndex}
            className="text containersubintel"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}>
            {Object.keys(subIntel).map((subIntelVal, subIntelValIndex) => (
              <div key={subIntelValIndex} className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  {subIntelVal.charAt(0).toUpperCase() + subIntelVal.slice(1).toLowerCase()}:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {subIntel[subIntelVal]}
                </span>
              </div>
            ))}
            {subIntel.hash && (
              <div>
                <button onClick={() => onOpenLeakedModal(subIntel, 'crack')} className="crack-btn">
                  click to crack
                </button>
              </div>
            )}
            {subIntel.regip && (
              <div>
                <button
                  onClick={() => onOpenLeakedModal(subIntel, 'geo')}
                  className="codefend-text-red no-outline bolder no-border">
                  click to geolocate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
