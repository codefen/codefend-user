import { type FC, useEffect, useState } from 'react';
import { useOrderStore, useSourceCode } from '../../../../../data';
import { SourceCodeResources } from './components/SourceCodeResources';
import { SourceCodeChart } from './components/SourceCodeChart';
import { SourceCodeCollab } from './components/SourceCodeCollab';
import { OrderV2, PrimaryButton } from '../../../../components';
import './sourcecode.scss';
import { useFlashlight } from '../../FlashLightContext';

const SourceCodePanel: FC = () => {
	const { getSource, isLoading, addSourceCode, deletedResource } =
		useSourceCode();
	const { updateState } = useOrderStore((state) => state);
	const [showScreen, setShowScreen] = useState(false);
	const flashlight = useFlashlight();
	useEffect(() => {
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [showScreen]);

	return (
		<>
			<OrderV2 />
			<main className={`source-code ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<SourceCodeResources
						isLoading={isLoading}
						sourceCode={getSource() ?? []}
						update={(params: any) => {
							addSourceCode(params).finally(() => {
								setShowScreen(false);
								setTimeout(() => {
									setShowScreen(true);
								}, 50);
							});
						}}
						onDelete={deletedResource}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<SourceCodeChart
						isLoading={isLoading}
						sourceCode={getSource() ?? []}
					/>

					<PrimaryButton
						text="START A PENTEST ON DEMAND"
						className="primary-full"
						click={() => updateState('open', open)}
					/>
					<br />
					<SourceCodeCollab />
				</section>
			</main>
		</>
	);
};

export default SourceCodePanel;
