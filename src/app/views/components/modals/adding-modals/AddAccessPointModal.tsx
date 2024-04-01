import { type FC } from 'react';

import { GlobeWebIcon, ModalButtons } from '../..';
import { useAddLan } from '@resourcesHooks/netowrk/useAddLan.ts';

interface ComponentEvent {
	onDone: () => void;
	close: () => void;
}

export const AcessPointModal: FC<ComponentEvent> = (props) => {
	const {
		vendorName,
		internalAddress,
		externalAddress,
		isLoading,
		validators,
		refetch,
		setNetworkData,
	} = useAddLan(props.onDone, props.close);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setNetworkData((prevData: any) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (validators()) return;

		refetch();
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>
					<select
						onChange={handleChange}
						className="log-inputs modal_info"
						value={vendorName}
						name="vendorName"
						required>
						<option value="" disabled>
							os / vendor
						</option>
						<option value="windows">windows</option>
						<option value="linux">linux</option>
						<option value="unknown">unknown</option>
						<option value="android">android</option>
						<option value="ios">ios</option>
					</select>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						name="domainName"
						onChange={handleChange}
						placeholder="hostname"
						required
					/>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						name="internalAddress"
						value={internalAddress}
						onChange={handleChange}
						placeholder="Internal IP Address"
						required
					/>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						name="externalAddress"
						value={externalAddress}
						onChange={handleChange}
						placeholder="External IP Address"
						required
					/>
				</div>

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						name="username"
						onChange={handleChange}
						placeholder="username"
					/>
				</div>
				<div
					className="form-input"
					onClick={(e: any) => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="password"
						name="password"
						onChange={handleChange}
						placeholder="Password"
					/>
				</div>
				<ModalButtons
					confirmText="Add access point"
					isDisabled={isLoading}
					close={() => props.close()}
				/>
			</form>
		</div>
	);
};

export default AcessPointModal;
