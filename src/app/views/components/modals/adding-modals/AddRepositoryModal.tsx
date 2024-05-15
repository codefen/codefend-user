import { type FC, useState } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
import { toast } from 'react-toastify';
import { useAddSourceCode } from '@resourcesHooks/sourcecode/useAddSourceCode';

interface AddRepositoryModalProps {
	onDone: () => void;
	close: () => void;
}

export const AddRepositoryModal: FC<AddRepositoryModalProps> = (props) => {
	const [sourceCodeForm, { isAddingSource, addSourceCode, setSourceCode }] =
		useAddSourceCode();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addSourceCode().then(() => {
			props.onDone();
			props.close();
		});
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={(e) =>
							setSourceCode((current) => ({
								...current,
								repositoryName: e.target.value,
							}))
						}
						placeholder="repository name"
						required
					/>
				</div>

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={(e) =>
							setSourceCode((current) => ({
								...current,
								repositoryUrl: e.target.value,
							}))
						}
						placeholder="repository url"
						required
					/>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>
					<input
						type="text"
						onChange={(e) =>
							setSourceCode((current) => ({
								...current,
								sourceCode: e.target.value,
							}))
						}
						placeholder="source code language"
						required
					/>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<select
						onChange={(e) =>
							setSourceCode((current) => ({
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

				<ModalButtons
					close={props.close!}
					isDisabled={isAddingSource}
					confirmText="Add repository"
				/>
			</form>
		</div>
	);
};
