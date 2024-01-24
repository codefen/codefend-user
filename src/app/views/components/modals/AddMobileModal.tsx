import React, { useCallback, useState } from 'react';
import { MobileService, useAuthState } from '../../../data';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons } from '..';

interface Props {
	onDone: () => void;
	close: () => void;
}

const AddMobileModal: React.FC<Props> = (props) => {
	const [androidAddress, setAndroidAddress] = useState('');
	const [iosAddress, setIosAddress] = useState('');
	const [isAddingMobile, setIsAddingMobile] = useState(false);
	const { getUserdata } = useAuthState();

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsAddingMobile(true);
			if (!androidAddress.trim() || androidAddress.length > 165) {
				toast.error('Invalid android address');
				setIsAddingMobile(false);
				return;
			}

			if (!iosAddress.trim() || iosAddress.length > 165) {
				toast.error('Invalid ios address');
				setIsAddingMobile(false);
				return;
			}
			MobileService.add(
				androidAddress,
				iosAddress,
				getUserdata()?.companyID as string,
			)
				.then((response) => {
					if (!response)
						throw new Error('An error has occurred on the server');

					props.onDone();
					props.close();
					toast.success('Successfully Added Mobile App...');
				})
				.catch((error: any) => {
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
			<div className="modal flex items-center justify-center p-3 text-format">
				<form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
					<div className="form-input text">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
						</span>

						<input
							type="text"
							onChange={(e) => {
								setAndroidAddress(e.target.value);
							}}
							placeholder="android download link"
						/>
					</div>

					<div className="form-input text">
						<span className="form-icon">
							<div className="codefend-text-red">
								<GlobeWebIcon />
							</div>
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
