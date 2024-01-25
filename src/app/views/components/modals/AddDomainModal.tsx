import React, { useState } from 'react';

import { GlobeWebIcon, ModalButtons } from '../';
import { toast } from 'react-toastify';
import { useAuthState, WebApplicationService } from '../../../data';

interface AddDomainProps {
	onDone: () => void;
	close?: () => void;
}

const AddDomainModal: React.FC<AddDomainProps> = (props) => {
	const [domainName, setDomainName] = useState('');
	const [subdomainDetection, setSubdomainDetection] = useState<boolean>(false);
	const [isAddingDomain, setIsAddingDomain] = useState<boolean>(false);

	const { getUserdata } = useAuthState();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsAddingDomain(true);
		if (
			!domainName.trim() ||
			domainName.length === 0 ||
			domainName.length > 100
		) {
			toast.error('Invalid domain');
			setIsAddingDomain(false);
			return;
		}
		const companyID = getUserdata()?.companyID as string;

		WebApplicationService.addResource(domainName, companyID)
			.then(({ response }) => {
				setDomainName('');
				props.onDone();
				toast.success('Successfully Added Domain..');
			})
			.catch((error: any) => {
				toast.error(error.message);
				props.close?.();
			})
			.finally(() => setIsAddingDomain(false));
		return;
	};
	return (
		<div className="modal admin-modal text-format">
			<form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
				<div className="form-input-text">
					<span className="form-icon">
						<div className="codefend-text-red">
							<GlobeWebIcon />
						</div>
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
					className=" form-input-checkbox"
					onClick={(e: React.FormEvent) => e.stopPropagation()}>
					<input
						type="checkbox"
						id="subdomain-detection-check"
						onChange={(e) => setSubdomainDetection(!subdomainDetection)}
						defaultChecked={subdomainDetection}
						className="codefend-checkbox"
						required
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
