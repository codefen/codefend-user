import React, { useCallback } from 'react';
import { generateIDArray } from '../../../data';

interface Props {
	riskScore: string;
}

export const RiskScore: React.FC<Props> = ({ riskScore }) => {
	const isValidRiskScore = useCallback((riskScore: string) => {
		return riskScore && !isNaN(parseInt(riskScore));
	}, []);

	const generateVulnerabilityArray = useCallback(
		(riskScore: string) =>
			isValidRiskScore(riskScore)
				? generateIDArray(parseInt(riskScore))
				: [],
		[isValidRiskScore],
	);

	const generateLimitedArray = useCallback(
		(riskScore: string) =>
			isValidRiskScore(riskScore)
				? [...generateIDArray(Math.max(0, 5 - parseInt(riskScore)))]
				: [...generateIDArray(5)],
		[isValidRiskScore],
	);

	return (
		<>
			<span className="mt-2" title={riskScore}>
				{riskScore ? riskScore : 0}
			</span>

			<span className="mr-1"></span>
			{generateVulnerabilityArray(riskScore).map((scoreKey: string) => (
				<span
					key={scoreKey}
					className="w-2 h-2 ml-0.5 mt-2 red-border rounded-full codefend-bg-red"></span>
			))}
			{generateLimitedArray(riskScore).map((scoreKey: string) => (
				<span
					key={scoreKey}
					className="w-2 h-2 ml-0.5 mt-2 codefend-border-red rounded-full"></span>
			))}
		</>
	);
};
