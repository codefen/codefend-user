import { type FC } from 'react';

interface RiskScoreProps {
  riskScore: string;
}

export const RiskScore: FC<RiskScoreProps> = ({ riskScore }) => {
  const parsedRiskScore = parseInt(riskScore);
  const vulnerabilityCount = Math.max(0, parsedRiskScore);
  const limitedCount = Math.max(0, 5 - parsedRiskScore);

  return (
    <div>
      <span className="score-value" title={riskScore}>
        {riskScore ? riskScore : 0}
      </span>
      <span className="dash-between-val-ball"></span>
      {Array.from({ length: vulnerabilityCount }, (_, index) => (
        <span
          key={`vulnerability_${index}`}
          className="score-ball red-border codefend-bg-red"></span>
      ))}
      {Array.from({ length: limitedCount }, (_, index) => (
        <span key={`limited_${index}`} className="score-ball codefend-border-red"></span>
      ))}
    </div>
  );
};
