import { type FC } from 'react';
import { useAddWebResourcce } from '@resourcesHooks/web/useAddWebResources';
import type { ComponentEventWithChildren } from '@interfaces/util';
import { ModalInput } from '@defaults/ModalInput';

const WebDomainForm: FC<ComponentEventWithChildren> = ({
	onDone,
	close,
	children,
}) => {
	const { handleAddResource, isAddingDomain, setDomainName } =
		useAddWebResourcce(onDone ? onDone : () => {}, close ? close : () => {});
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleAddResource();
		return;
	};
	return (
		<form className="form" onSubmit={handleSubmit}>
			<ModalInput
				setValue={(val: string) => setDomainName(val)}
				placeholder="domain name"
				required
			/>
			{children(isAddingDomain)}
		</form>
	);
};

export default WebDomainForm;
