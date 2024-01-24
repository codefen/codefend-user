import React, { useEffect, useState } from 'react';
import { useModal, useSourceCode } from '../../../../../data';
import { SourceCodeResources } from './components/SourceCodeResources';
import { SourceCodeChart } from './components/SourceCodeChart';
import { SourceCodeCollab } from './components/SourceCodeCollab';
import { PrimaryButton } from '../../../../components';
import './sourcecode.scss';

const SourceCodePanel: React.FC = () => {
	const { getSource, isLoading, addSourceCode, deletedResource } =
		useSourceCode();
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [showScreen]);

	return (
		<>
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
				<section className="right">
					<SourceCodeChart
						isLoading={isLoading}
						sourceCode={getSource() ?? []}
					/>

					<PrimaryButton
						text="REQUEST SCAN"
						className="w-full mt-4"
						click={() => alert('Processing your order')}
					/>
					<br />
					<SourceCodeCollab />
				</section>
			</main>
		</>
	);
};

export default SourceCodePanel;
