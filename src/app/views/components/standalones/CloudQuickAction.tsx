import { useCallback, useState, type FC } from 'react';
import { toast } from 'react-toastify';
import { type User, useAuthState } from '../../../data';

import {
	ButtonLoader,
	GlobeWebIcon,
	ModalButtons,
	PrimaryButton,
	Show,
} from '..';

interface CloudQuickActionProps {
	onDone: () => void;
}

export const CloudQuickAction: FC<CloudQuickActionProps> = (props) => {
	const { getUserdata, getCompany } = useAuthState();
	const [domainName, setDomainName] = useState('');
	const [isAddingDomain, setIsAddingDomain] = useState(false);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			setIsAddingDomain(true);
			if (domainName) return;

			if (
				!domainName ||
				domainName.length === 0 ||
				domainName.length > 100
			) {
				toast.error('Invalaid domain');
				return setIsAddingDomain(false);
			}
			const requestParams = {
				company_id: getCompany(),
				resource_address_domain: domainName,
			};

			Promise.resolve()
				.then(() => {
					setDomainName('');
					props.onDone();
					toast.success('Successfully Added Domain...');
				})
				.finally(() => {
					setIsAddingDomain(false);
				});
		},
		[domainName, getUserdata],
	);

	return (
		<div className="cloud-quick-actions text-format">
			<form onSubmit={handleSubmit}>
				<div className="input-group">
					<span>
						<div className="icon codefend-text-red">
							<GlobeWebIcon />
						</div>
					</span>

					<input
						className="log-inputs"
						type="text"
						onChange={(e) => setDomainName(e.target.value)}
						id="quick-domain-name"
						placeholder="action"
						required
					/>
				</div>

				<ModalButtons
					close={() => {}}
					closeText="cancel"
					confirmText="add action"
					isDisabled={isAddingDomain}
				/>
			</form>
		</div>
	);
};
