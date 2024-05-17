import { type FC } from 'react';
import { GlobeWebIcon } from '@icons';
import { useAddSourceCode } from '@resourcesHooks/sourcecode/useAddSourceCode';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const SourceResourceForm: FC<ComponentEventWithChildren> = ({
	close,
	onDone,
	children,
}) => {
	const [sourceCodeForm, { isAddingSource, addSourceCode, setSourceCode }] =
		useAddSourceCode();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addSourceCode().then(() => {
			onDone?.();
			close?.();
		});
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<ModalInput
				setValue={(val: string) =>
					setSourceCode((current: any) => ({
						...current,
						repositoryName: val,
					}))
				}
				placeholder="repository name"
				required
			/>
			<ModalInput
				setValue={(val: string) =>
					setSourceCode((current: any) => ({
						...current,
						repositoryUrl: val,
					}))
				}
				placeholder="repository url"
				required
			/>
			<ModalInput
				setValue={(val: string) =>
					setSourceCode((current: any) => ({
						...current,
						sourceCode: val,
					}))
				}
				placeholder="source code language"
				required
			/>

			<div className="form-input">
				<span className="icon">
					<GlobeWebIcon />
				</span>

				<select
					onChange={(e) =>
						setSourceCode((current: any) => ({
							...current,
							visibility: e.target.value,
						}))
					}
					className="log-inputs modal_info"
					value={sourceCodeForm.visibility}
					required>
					<option value="" disabled hidden>
						visibility
					</option>
					<option value="public">public</option>
					<option value="private">private</option>
				</select>
			</div>
			{children(isAddingSource)}
		</form>
	);
};
