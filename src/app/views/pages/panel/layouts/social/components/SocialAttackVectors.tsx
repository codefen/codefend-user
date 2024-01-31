import { ChartIcon, SimpleSection } from '../../../../../components';
import { defaultSocialAttackVectors } from '../../../../../../data';
import React, { useState } from 'react';

interface SocialAttackVectorsProps {
	defaultSocialAttackVectors?: Record<string, 'enabled' | 'disabled'>;
}

const SocialAttackVectors: React.FC<SocialAttackVectorsProps> = (props) => {
	const [attackVectorState, setAttackVectorState] = useState(
		props.defaultSocialAttackVectors || defaultSocialAttackVectors,
	);

	const handleCheckboxChange = (attack: string) => {
		setAttackVectorState((prevAttackVectors) => {
			const updatedState = { ...prevAttackVectors };
			updatedState[attack as keyof typeof updatedState] =
				prevAttackVectors[attack as keyof typeof updatedState] === 'enabled'
					? 'disabled'
					: 'enabled';
			return updatedState;
		});
	};

	return (
		<>
			<div className="card filtered">
				<SimpleSection header="Attak vectors" icon={<ChartIcon />}>
					<div className="content filters">
						{Object.keys(attackVectorState).map((attack: string) => (
							<div className="filter" key={attack}>
								<div className="check">
									<label className="label">
										<input
											type="checkbox"
											checked={
												attackVectorState[
													attack as keyof typeof attackVectorState
												] === 'enabled'
											}
											className="codefend-checkbox"
											onChange={() => handleCheckboxChange(attack)}
										/>
										{attack}
									</label>
								</div>
								<span>
									{
										attackVectorState[
											attack as keyof typeof attackVectorState
										]
									}
								</span>
							</div>
						))}
					</div>
				</SimpleSection>
			</div>
		</>
	);
};

export default SocialAttackVectors;
