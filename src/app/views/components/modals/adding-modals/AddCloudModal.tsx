import { type FC } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon, PencilIcon } from '@icons';
import { useAddCloud } from '@resourcesHooks/cloud/useAddCloud.ts';

interface Props {
	onDone: () => void;
	close: () => void;
}

export const AddCloudModal: FC<Props> = (props) => {
	const {
		provider,
		refetch,
		isAddingCloud,
		setAppName,
		setProvider,
		setDescription,
		validations,
	} = useAddCloud(props.close, props.onDone);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (validations()) return;

		refetch();
	};

	return (
		<div className="content">
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
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={(e) => setAppName(e.target.value)}
						placeholder="name"
						required
					/>
				</div>

				<div className="form-input">
					<span className="pencil-icon need-m">
						<PencilIcon />
					</span>
					<textarea
						onChange={(e) => setDescription(e.target.value)}
						name="desc"
						placeholder="short description"
						className="text-area-input log-inputs2 text-area "
						maxLength={600}></textarea>
				</div>

				<ModalButtons
					close={props.close}
					isDisabled={isAddingCloud}
					confirmText="Add cloud"
				/>
			</form>
		</div>
	);
};
