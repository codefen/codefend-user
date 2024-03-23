import { Fragment, useMemo, type FC } from 'react';

import { ModalWrapper, ChartIcon, EmptyCard, SimpleSection, Show } from '..';
import { CloudQuickAction } from './CloudQuickAction';

import { TestingCredentialCard } from './TestingCredentialCard';
import { generateIDArray } from '../../../data';

interface ProvidedTestingCredentialsProps {
	refetch?: () => void;
	isLoading: boolean;
	credentials: any;
}

export const ProvidedTestingCredentials: FC<ProvidedTestingCredentialsProps> = (
	props,
) => {
	const credentialKey = useMemo(
		() =>
			props.credentials && props.credentials.length !== 0
				? generateIDArray(props.credentials.length)
				: [],
		[props.credentials],
	);

	return (
		<>
			{props.isLoading ?? (
				<ModalWrapper action={() => {}}>
					<div className="quick-action internal-tables disable-border">
						<div className="modal-header">
							|<span>{' Add cloud actions '}</span>|
						</div>

						<CloudQuickAction onDone={() => props.refetch?.()} />

						<div className="helper-box"></div>
					</div>
				</ModalWrapper>
			)}

			<div className="card user-list">
				<SimpleSection
					header="provided testing credentials"
					icon={<ChartIcon />}>
					<div className="list">
						<Show
							when={!props.isLoading && props.credentials.length !== 0}>
							{props.credentials.map((cred: any, index: number) => (
								<TestingCredentialCard
									key={credentialKey[index]}
									{...cred}
									hideBorderBottom={
										props.credentials.legth - 1 === index
									}
								/>
							))}
						</Show>
					</div>
				</SimpleSection>
			</div>
			<Show when={!props.isLoading && props.credentials.length === 0}>
				<EmptyCard />
			</Show>
		</>
	);
};
