import { type FC } from 'react';
import { useOrderStore } from '@stores/orders.store.ts';
import { useSourceCode } from '@resourcesHooks/sourcecode/useSourceCode.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { SourceCodeResources } from './components/SourceCodeResources.tsx';
import { SourceCodeChart } from './components/SourceCodeChart.tsx';
import { SourceCodeCollab } from './components/SourceCodeCollab.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import './sourcecode.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/index.ts';

const SourceCodePanel: FC = () => {
	const [showScreen, _, refresh] = useShowScreen();
	const { getSource, isLoading, addSourceCode, deletedResource } =
		useSourceCode();
	const { isAdmin, isNormalUser } = useUserRole();
	const { updateState, scope } = useOrderStore((state) => state);
	const flashlight = useFlashlight();

	return (
		<>
			<OrderV2 />
			<CredentialsModal />
			<ModalReport />
			<main className={`source-code ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<SourceCodeResources
						isLoading={isLoading}
						sourceCode={getSource() ?? []}
						update={(params: any) => {
							addSourceCode(params)?.finally(() => refresh());
						}}
						onDelete={deletedResource}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<SourceCodeChart
						isLoading={isLoading}
						sourceCode={getSource() || []}
					/>
					{isAdmin() || isNormalUser() ? (
						<PrimaryButton
							text="START A PENTEST ON DEMAND"
							className="primary-full"
							click={() => updateState('open', open)}
							disabledLoader
							isDisabled={scope.totalResources <= 0}
						/>
					) : null}

					<SourceCodeCollab />
				</section>
			</main>
		</>
	);
};

export default SourceCodePanel;
