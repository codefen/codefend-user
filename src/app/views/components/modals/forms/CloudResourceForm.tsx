import { type FC } from 'react';
import { GlobeWebIcon } from '@icons';
import { useAddCloud } from '@resourcesHooks/cloud/useAddCloud.ts';
import { ModalTextArea } from '@defaults/ModalTextArea';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const CloudResourceForm: FC<ComponentEventWithChildren> = ({
	close,
	onDone,
	children,
}) => {
	const {
		provider,
		refetch,
		isAddingCloud,
		setAppName,
		setProvider,
		setDescription,
		validations,
	} = useAddCloud(onDone ? onDone : () => {}, close ? close : () => {});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (validations()) return;
		refetch();
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<div className="form-input">
				<span className="icon">
					<GlobeWebIcon />
				</span>

				<select
					onChange={(e) => setProvider(e.target.value)}
					className="log-inputs modal_info"
					id="select-provider-cloud"
					value={provider}
					required>
					<option value="" disabled hidden>
						Provider
					</option>
					<option value="azure">Azure</option>
					<option value="aws">AWS</option>
					<option value="google">Google</option>
				</select>
			</div>
			<ModalInput
				setValue={(val: string) => setAppName(val)}
				placeholder="name"
				required
			/>

			<ModalTextArea
				setValue={(val: string) => setDescription(val)}
				placeholder="short description"
				maxLength={600}
			/>
			{children(isAddingCloud)}
		</form>
	);
};
