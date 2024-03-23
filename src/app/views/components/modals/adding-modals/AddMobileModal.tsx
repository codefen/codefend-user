import { type FC, useCallback, useState, type FormEvent } from 'react';
import { MobileService, useAuthState } from '../../../../data';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons } from '../..';

interface Props {
	onDone: () => void;
	close: () => void;
}

const AddMobileModal: FC<Props> = (props) => {
	const [androidAddress, setAndroidAddress] = useState('');
	const [iosAddress, setIosAddress] = useState('');
	const [isAddingMobile, setIsAddingMobile] = useState(false);
	const { getCompany } = useAuthState();

	const handleSubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsAddingMobile(true);
			if (androidAddress.length > 165) {
				toast.error('Invalid android address');
				setIsAddingMobile(false);
				return;
			}

			if (iosAddress.length > 165) {
				toast.error('Invalid ios address');
				setIsAddingMobile(false);
				return;
			}

			if (!iosAddress.trim() && !androidAddress.trim()) {
				toast.error('Kindly fill in field(s)');
				setIsAddingMobile(false);
				return;
			}

			MobileService.add(
				androidAddress.trim(),
				iosAddress.trim(),
				getCompany(),
			)
				.then((response: any) => {
					if (
						response.android_error ||
						response.apple_error ||
						response.isAnError
					) {
						throw new Error(
							response.android_info ??
								'An error has occurred on the server',
						);
					}

					props.onDone();
					props.close();
					toast.success('Successfully Added Mobile App...');
				})
				.catch((error: Error) => {
					toast.error(error.message);
					props.close();
				})
				.finally(() => {
					setIsAddingMobile(false);
				});
		},
		[androidAddress, iosAddress],
	);

	return (
		<>
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
		</>
	);
};

export default AddMobileModal;
