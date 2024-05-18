import { type FC } from 'react';
import { useAddSocial } from '@resourcesHooks/social/useAddSocial';
import { GlobeWebIcon } from '@icons';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const SocialResourceForm: FC<ComponentEventWithChildren> = ({
	close,
	onDone,
	children,
}) => {
	const {
		handleAddSocialResource,
		validations,
		role,
		isAddingMember,
		setSocialData,
	} = useAddSocial(onDone ? onDone : () => {}, close ? close : () => {});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (validations()) return;
		handleAddSocialResource();
	};

	return (
		<form className="form" onSubmit={handleSubmit}>
			<ModalInput
				setValue={(val: string) =>
					setSocialData((prevData) => ({
						...prevData,
						fName: val,
					}))
				}
				placeholder="name"
			/>

			<ModalInput
				setValue={(val: string) =>
					setSocialData((prevData) => ({
						...prevData,
						lName: val,
					}))
				}
				placeholder="last name"
			/>

			<ModalInput
				setValue={(val: string) =>
					setSocialData((prevData) => ({
						...prevData,
						mail: val,
					}))
				}
				placeholder="email address"
			/>

			<ModalInput
				setValue={(val: string) =>
					setSocialData((prevData) => ({
						...prevData,
						phone: val,
					}))
				}
				placeholder="phone number"
			/>

			<div className="form-input">
				<span className="icon">
					<GlobeWebIcon />
				</span>
				<select
					onChange={(e) =>
						setSocialData((prevData) => ({
							...prevData,
							role: e.target.value,
						}))
					}
					id="social-data"
					className="log-inputs modal_info"
					value={role}
					required>
					<option value="" disabled hidden>
						role
					</option>
					<option value="admin">administrative</option>
					<option value="human">human resources</option>
					<option value="info">information tech</option>
					<option value="ads">marketing</option>
					<option value="sales">sales</option>
					<option value="finance">finance</option>
					<option value="cs">customer service</option>
					<option value="prod">production & ops</option>
					<option value="plan">strategy & planning</option>
					<option value="law">legal affairs</option>
				</select>
			</div>
			{children(isAddingMember)}
		</form>
	);
};

export default SocialResourceForm;
