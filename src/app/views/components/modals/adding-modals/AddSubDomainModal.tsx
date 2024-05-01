import { type FC, type FormEvent } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
import { useAddSubResource } from '@resourcesHooks/web/useWebapplication.ts';
import { type Webresources } from '@interfaces/panel.ts';

interface SubdomainModalProps {
	onDone: () => void;
	close: () => void;
	webResources: Webresources[];
}

const AddSubDomainModal: FC<SubdomainModalProps> = (props) => {
	const {
		handleAddSubResource,
		setDomainName,
		setIpAddress,
		setMainDomainId,
		isAddingSubDomain,
		mainDomainId,
	} = useAddSubResource(props.onDone, props.close);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		handleAddSubResource();
	};

	return (
		<div className="content subdomain-modal">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<div className="codefend-text-red">
							<GlobeWebIcon />
						</div>
					</span>
					<select
						onChange={(e) => setMainDomainId(e.target.value)}
						value={mainDomainId}
						className="log-inputs modal_info"
						name="Main resource"
						id="select-subdomain-resources"
						required>
						<option value="" disabled hidden selected>
							main resource
						</option>
						{props.webResources
							.reverse()
							.map((resource: Webresources) => (
								<option key={resource.id} value={resource.id}>
									{resource.resourceDomain}
								</option>
							))}
					</select>
				</div>

				<div className="form-input">
					<span className="icon">
						<div className="codefend-text-red">
							<GlobeWebIcon />
						</div>
					</span>
					<input
						type="text"
						onChange={(e) => setDomainName(e.target.value)}
						placeholder="domain name"
						required
					/>
				</div>

				<ModalButtons
					close={props.close!}
					isDisabled={isAddingSubDomain}
					confirmText="Add web resource"
				/>
			</form>
		</div>
	);
};

export default AddSubDomainModal;
