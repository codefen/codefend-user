import { useRef, type FC } from 'react';
import { GlobeWebIcon } from '@icons';
import { useAddCloud } from '@resourcesHooks/cloud/useAddCloud.ts';
import { ModalTextArea } from '@defaults/ModalTextArea';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';

export const CloudResourceForm: FC<ComponentEventWithChildren> = ({
	close,
	onDone,
	children,
}) => {
	const provider = useRef<HTMLSelectElement>(null);
	const appName = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLTextAreaElement>(null);

	const { setNewApp } = useSelectedApp();
	const { refetch, isAddingCloud, validations } = useAddCloud(
		onDone ? onDone : () => {},
		close ? close : () => {},
	);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (
			validations(
				appName.current?.value || '',
				provider.current?.value || '',
			)
		) {
			return;
		}

		refetch(
			appName.current?.value || '',
			provider.current?.value || '',
			description.current?.value || '',
		).then((data: any) => {
			setNewApp(data.resources_cloud);
		});
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<div className="form-input">
				<span className="icon">
					<GlobeWebIcon />
				</span>

				<select
					ref={provider}
					className="log-inputs modal_info"
					id="select-provider-cloud"
					required>
					<option value="" disabled hidden>
						Provider
					</option>
					<option value="azure">Azure</option>
					<option value="aws">AWS</option>
					<option value="google">Google</option>
				</select>
			</div>
			<ModalInput ref={appName} placeholder="name" required />

			<ModalTextArea
				ref={description}
				placeholder="short description"
				maxLength={600}
			/>
			{children(isAddingCloud)}
		</form>
	);
};
