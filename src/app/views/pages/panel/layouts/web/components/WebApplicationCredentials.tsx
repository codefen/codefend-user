import React from 'react';
import { ChartIcon } from '@icons';
import { StatAsset } from '@/app/components/stat-asset/StatAsset';

export const WebApplicationCredentials: React.FC = () => {
  return (
    <div className="card stats">
      <div className="over">
        <div className="header">
          <div className="title">
            <div className="icon">
              <ChartIcon />
            </div>
            <span>Credentials statics</span>
          </div>

          <div className="actions"></div>
        </div>
        <div className="content">
          <StatAsset value="0" valueTitle="Admin credentials" />
          <StatAsset value="0" valueTitle="User credentials" />
        </div>
      </div>
    </div>
  );
};
