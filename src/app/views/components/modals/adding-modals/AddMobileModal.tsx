import { type FC, type FormEvent } from 'react';
import { useAddMobileResource } from '@resourcesHooks/mobile/useAddMobileResource';
import { GlobeWebIcon, ModalButtons } from '../..';

interface Props {
	onDone: () => void;
	close: () => void;
}

const AddMobileModal: FC<Props> = (props) => {
	const {
		handleAddMobileResource,
		setAndroidAddress,
		setIosAddress,
		isAddingMobile,
	} = useAddMobileResource();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		handleAddMobileResource(props.onDone, props.close);
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
						onChange={(e) => {
							setAndroidAddress(e.target.value);
						}}
						placeholder="android download link"
					/>
				</div>

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={(e) => {
							setIosAddress(e.target.value);
						}}
						placeholder="ios download link"
					/>
				</div>
				<ModalButtons
					close={props.close}
					isDisabled={isAddingMobile}
					confirmText="Add mobile app"
				/>
			</form>
		</div>
	);
};

export default AddMobileModal;
