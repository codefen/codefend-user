import { useAddResourceCredentials } from '@resourcesHooks/useAddResourceCredentials';
import type { FC } from 'react';
import { GlobeWebIcon, PencilIcon } from '@icons';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';

interface AddCredentialsProps {
	type: string;
	resourceId: string;
	close: () => void;
}

export const AddCredentials: FC<AddCredentialsProps> = ({
	type,
	resourceId,
	close,
}) => {
	const { handleSend, setCredentials, isLoading } =
		useAddResourceCredentials();

	const handleClickSend = (e: any) => {
		e.preventDefault();
		handleSend(type, resourceId);
		close();
	};

	return (
		<form className="form" onSubmit={handleClickSend}>
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
				<span className="icon">
					<GlobeWebIcon />
				</span>

				<select
					onChange={(e) =>
						setCredentials((prev) => ({
							...prev,
							accessLevel: e.target.value,
						}))
					}
					className="log-inputs modal_info"
					defaultValue="none"
					required>
					<option value="none" disabled>
						Access Level
					</option>
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</select>
			</div>
			<div className="form-input">
				<span className="pencil-icon need-m down-top">
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
				close={close}
				isDisabled={isLoading}
				confirmText="Add credential"
			/>
		</form>
	);
};
