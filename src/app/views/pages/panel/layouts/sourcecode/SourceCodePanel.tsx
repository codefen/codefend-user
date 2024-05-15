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
import './sourcecode.scss';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ModalReport } from '@modals/index.ts';
import { AxiosHttpService } from '@services/axiosHTTP.service.ts';
import EmptyScreenView from '@defaults/EmptyScreenView.tsx';
import Show from '@defaults/Show.tsx';

const SourceCodePanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const { data, isLoading, refetch } = useSourceCode();
	const { isAdmin, isNormalUser } = useUserRole();
	const { updateState, scope } = useOrderStore((state) => state);
	const flashlight = useFlashlight();

	useEffect(() => {
		refetch();
	}, [control]);

	return (
		<>
			<OrderV2 />
			<CredentialsModal />
			<ModalReport />
			<main className={`source-code ${showScreen ? 'actived' : ''}`}>
				<Show when={!isLoading && Boolean(data?.length)}>
					<section className="left">
						<SourceCodeResources
							isLoading={isLoading}
							sourceCode={data ? data : []}
							refetch={refresh}
						/>
					</section>
					<section className="right" ref={flashlight.rightPaneRef}>
						<SourceCodeChart
							isLoading={isLoading}
							sourceCode={data ? data : []}
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
				</Show>
				<Show when={!isLoading && !Boolean(data?.length)}>
					<EmptyScreenView
						type="source"
						buttonText="Add Source"
						title="There's no data to display here"
						info="Start by adding a new source code resource"
						event={refetch}
					/>
				</Show>
			</main>
		</>
	);
};

export default SourceCodePanel;
