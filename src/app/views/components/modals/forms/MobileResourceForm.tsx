import { type FC, type FormEvent } from 'react';
import { useAddMobileResource } from '@resourcesHooks/mobile/useAddMobileResource';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

const MobileResourceForm: FC<ComponentEventWithChildren> = ({
	close,
	onDone,
	children,
}) => {
	const {
		handleAddMobileResource,
		setAndroidAddress,
		setIosAddress,
		isAddingMobile,
	} = useAddMobileResource();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		handleAddMobileResource(
			onDone ? onDone : () => {},
			close ? close : () => {},
		);
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<ModalInput
				setValue={(val: string) => setAndroidAddress(val)}
				placeholder="android download link"
			/>
			<ModalInput
				setValue={(val: string) => setIosAddress(val)}
				placeholder="ios download link"
			/>
			{children(isAddingMobile)}
		</form>
	);
};

export default MobileResourceForm;
