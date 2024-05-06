import { type FC, useState } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
import { toast } from 'react-toastify';

interface AddRepositoryModalProps {
	onDone: (params: any) => void;
	close: () => void;
}
interface RepositoryModel {
	repositoryName: string;
	repositoryUrl: string;
	sourceCode: string;
	visibility: string;

	isLoading: boolean;
}

export const AddRepositoryModal: FC<AddRepositoryModalProps> = (props) => {
	const [sourceCodeForm, setSourceCode] = useState<RepositoryModel>({
		repositoryName: '',
		repositoryUrl: '',
		sourceCode: '',
		visibility: '',

		isLoading: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setSourceCode((current) => ({ ...current, isLoading: true }));
		const { repositoryName, repositoryUrl, sourceCode, visibility } =
			sourceCodeForm;
		if (
			!repositoryName.trim() ||
			repositoryName.length == 0 ||
			repositoryName.length > 150
		) {
			toast.error('Invalid name');
			setSourceCode((current) => ({ ...current, isLoading: false }));
			return;
		}

		if (
			!repositoryUrl.trim() ||
			repositoryUrl.length == 0 ||
			repositoryUrl.length > 150
		) {
			toast.error('Invalid url');
			setSourceCode((current) => ({ ...current, isLoading: false }));
			return;
		}

		if (
			!sourceCode.trim() ||
			sourceCode.length == 0 ||
			sourceCode.length > 30
		) {
			toast.error('Invalid language');
			setSourceCode((current) => ({ ...current, isLoading: false }));
			return;
		}
		if (!visibility.trim()) {
			toast.error('Select visibility');
			setSourceCode((current) => ({ ...current, isLoading: false }));
			return;
		}

		const requestParams = {
			name: repositoryName,
			access_link: repositoryUrl,
			source_code: sourceCode,
			is_public: visibility === 'public' ? 'yes' : 'no',
		};
		props.onDone(requestParams);
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
							setSourceCode((current: RepositoryModel) => ({
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
							setSourceCode((current: RepositoryModel) => ({
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
							setSourceCode((current: RepositoryModel) => ({
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
							setSourceCode((current: RepositoryModel) => ({
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
					isDisabled={sourceCodeForm.isLoading}
					confirmText="Add repository"
				/>
			</form>
		</div>
	);
};
