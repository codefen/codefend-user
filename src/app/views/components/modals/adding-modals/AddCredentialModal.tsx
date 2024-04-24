import { GlobeWebIcon, PencilIcon } from '@icons';
import { ModalTitleWrapper } from '..';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import useModalStore from '@stores/modal.store';
import useCredentialStore from '@stores/credential.store';
import { useState } from 'react';
import { useAddResourceCredentials } from '@resourcesHooks/useAddResourceCredentials';

export const AddCredentialModal = () => {
	const { isOpen, modalId, setIsOpen } = useModalStore();
	const { type, resourceId } = useCredentialStore();
	const { addCrdentials, isLoading } = useAddResourceCredentials();
	const [credentials, setCredentials] = useState({
		userNameOrEmail: '',
		password: '',
		grades: '',
	});

	const handleSend = () => {
		const { userNameOrEmail, password, grades } = credentials;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const username = !emailPattern.test(userNameOrEmail)
			? userNameOrEmail
			: '';
		const email = emailPattern.test(userNameOrEmail) ? userNameOrEmail : '';

		addCrdentials(type, resourceId, username, email, password, grades);
	};

	return (
		<ModalTitleWrapper
			close={() => setIsOpen(false)}
			headerTitle={`Add ${type} credential`}
			isActive={isOpen && modalId == type}>
			<div className="content">
				<form className="form" onSubmit={handleSend}>
					<div className="form-input">
						<span className="icon">
							<GlobeWebIcon />
						</span>

						<input
							type="text"
							onChange={(e) =>
								setCredentials((prev) => ({
									...prev,
									userNameOrEmail: e.target.value,
								}))
							}
							placeholder="User credential (Username or Email)"
							required
						/>
					</div>
					<div className="form-input">
						<span className="icon">
							<GlobeWebIcon />
						</span>

						<input
							type="password"
							onChange={(e) =>
								setCredentials((prev) => ({
									...prev,
									password: e.target.value,
								}))
							}
							placeholder="Password credential"
							required
						/>
					</div>
					<div className="form-input">
						<span className="pencil-icon need-m">
							<PencilIcon isButton />
						</span>

						<textarea
							onChange={(e) =>
								setCredentials((prev) => ({
									...prev,
									grades: e.target.value,
								}))
							}
							placeholder="You can provide additional information for access."
							className="text-area-input xll log-inputs2 text-area "
							maxLength={4000}
							required></textarea>
					</div>

					<ModalButtons
						close={() => setIsOpen(false)}
						isDisabled={false}
						confirmText="Add credential"
					/>
				</form>
			</div>
		</ModalTitleWrapper>
	);
};
