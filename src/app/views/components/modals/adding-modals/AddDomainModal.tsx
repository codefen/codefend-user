import { type FC, useState } from 'react';

import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
import { useAddWebResourcce } from '@resourcesHooks/web/useAddWebResources';

interface AddDomainProps {
	onDone: () => void;
	close: () => void;
	webResources: string[];
}

const AddDomainModal: FC<AddDomainProps> = (props) => {
	const { handleAddResource, isAddingDomain, setDomainName } =
		useAddWebResourcce(props.onDone, props.close);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleAddResource();
		return;
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
						className="log-inputs"
						placeholder="domain name"
						onChange={(e) => setDomainName(e.target.value)}
						required
					/>
				</div>

				<ModalButtons
					close={props.close!}
					isDisabled={isAddingDomain}
					confirmText="Add web resource"
				/>
			</form>
		</div>
	);
};

export default AddDomainModal;
