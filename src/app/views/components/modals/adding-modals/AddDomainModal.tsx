import { type FC, useState } from 'react';
import { toast } from 'react-toastify';

import { GlobeWebIcon, ModalButtons } from '../..';
import { useAuthState, WebApplicationService } from '../../../../data';

interface AddDomainProps {
	onDone: () => void;
	close?: () => void;
	webResources: string[];
}

const AddDomainModal: FC<AddDomainProps> = (props) => {
	const [domainName, setDomainName] = useState('');
	const [subdomainDetection, setSubdomainDetection] = useState<boolean>(true);
	const [isAddingDomain, setIsAddingDomain] = useState<boolean>(false);

	const { getCompany } = useAuthState();

	const handleSubmit = (e: React.FormEvent) => {
		if (!domainName) return;
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

		const companyID = getCompany();

		WebApplicationService.addResource(domainName, companyID)
			.then((response: any) => {
				if (response.isAnError || Number(response.error) > 0) {
					throw new Error('An error has occurred on the server');
				}

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
