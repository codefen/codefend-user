import { useEffect, type FC } from 'react';
import { useOrderStore } from '@stores/orders.store.ts';
import { useSourceCode } from '@resourcesHooks/sourcecode/useSourceCode.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { SourceCodeResources } from './components/SourceCodeResources.tsx';
import { SourceCodeChart } from './components/SourceCodeChart.tsx';
import { SourceCodeCollab } from './components/SourceCodeCollab.tsx';
import { OrderV2 } from '@modals/order/Orderv2.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/reports/ModalReport.tsx';
import EmptyLayout from '../EmptyLayout.tsx';
import './sourcecode.scss';
import { RESOURCE_CLASS } from '@/app/constants/app-texts.ts';

const SourceCodePanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { data, isLoading, refetch } = useSourceCode();
	const { isAdmin, isNormalUser } = useUserRole();
	const { updateState, scope } = useOrderStore((state) => state);
	const flashlight = useFlashlight();

	useEffect(() => {
		refetch();
	}, [control]);

	const socialEmptyScreen = {
		type: RESOURCE_CLASS.SOURCE,
		title: "There's no data to display here",
		subtitle: 'Start by adding a new source code resource',
		btnText: 'Add source code',
		event: refetch,
	};
	return (
		<>
			<OrderV2 />
			<CredentialsModal />
			<ModalReport />
			<EmptyLayout
				className="source-code"
				fallback={socialEmptyScreen}
				showScreen={showScreen}
				isLoading={isLoading}
				dataAvalaible={Boolean(data.length)}>
				<section className="left">
					<SourceCodeResources
						isLoading={isLoading}
						sourceCode={data}
						refetch={refresh}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<SourceCodeChart isLoading={isLoading} sourceCode={data} />
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
			</EmptyLayout>
		</>
	);
};

export default SourceCodePanel;
