import { type FC, useState } from 'react';

import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
import { useAddWebResourcce } from '@resourcesHooks/web/useWebapplication.ts';

interface AddDomainProps {
	onDone: () => void;
	close: () => void;
	webResources: string[];
}

const AddDomainModal: FC<AddDomainProps> = (props) => {
	const [subdomainDetection, setSubdomainDetection] = useState<boolean>(true);
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

				<div
					className="form-checkbox"
					onClick={(e: React.FormEvent) => e.stopPropagation()}>
					<input
						type="checkbox"
						id="subdomain-detection-check"
						onChange={(e) => setSubdomainDetection(!subdomainDetection)}
						defaultChecked={subdomainDetection}
						className="codefend-checkbox"
					/>
					<label
						className="modal_info"
						htmlFor="subdomain-detection-check">
						Automatic subdomain detection
					</label>
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
