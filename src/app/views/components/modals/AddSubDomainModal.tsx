import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { GlobeWebIcon, ModalButtons } from '../';
import {
	User,
	WebApplicationService,
	Webresources,
	useAuthState,
} from '../../../data';

interface SubdomainModalProps {
	onDone: () => void;
	close: () => void;
	webResources: Webresources[];
}

const AddSubDomainModal: React.FC<SubdomainModalProps> = (props) => {
	const [mainDomainId, setMainDomainId] = useState('');
	const [domainName, setDomainName] = useState('');
	const [ipAddress, setIpAddress] = useState('');
	const [isAddingSubDomain, setIsAddingSubDomain] = useState(false);
	const { getUserdata } = useAuthState();

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!mainDomainId || mainDomainId.length == 0) {
				toast.error('Invalid main resource');
				return;
			}

			if (!domainName || domainName.length == 0 || domainName.length > 100) {
				toast.error('Invalid domain');
				return;
			}

			setIsAddingSubDomain(true);

			const user = getUserdata() as User;
			const companyID = user?.companyID as string;

			WebApplicationService.addSubresource(
				mainDomainId,
				domainName,
				companyID,
			)
				.then((response: any) => {
					if (!response && !response.company)
						throw new Error('An error has occurred on the server');

					setDomainName('');
					props.onDone();
					toast.success('Successfully Added Domain..');
				})
				.catch((error: any) => {
					toast.error(error.message);
					props.close?.();
				})
				.finally(() => setIsAddingSubDomain(false));
		},
		[domainName, mainDomainId],
	);

	return (
		<div className="content subdomain-modal">
			<form className="flex flex-col w-full gap-y-3" onSubmit={handleSubmit}>
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
						<option value="" disabled>
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

				<div className="form-input">
					<span className="icon">
						<div className="codefend-text-red">
							<GlobeWebIcon />
						</div>
					</span>
					<input
						type="text"
						onChange={(e) => setIpAddress(e.target.value)}
						placeholder="IP address"
						disabled
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
