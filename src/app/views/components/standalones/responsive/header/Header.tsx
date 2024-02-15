import React from 'react';
import { Logo } from '../..';
import { LogoutIcon, NetworkIcon } from '../../../';
import {
	useNetworkSettingState,
	usePanelStore,
} from '../../../../../data/store/';
import { useModal } from '../../../../../data';

const Header: React.FC = () => {
	const { open, handleChange } = usePanelStore();
	const { setNetworkSettingState } = useNetworkSettingState((state) => state);
	const { showModal, setShowModal, setShowModalStr } = useModal();

	return (
		<nav className="flex flex-col">
			<div>
				<div className="flex items-center justify-around border-b cursor-pointer min-h-20 ">
					<div>
						<div className="navbar-logo">
							<span
								className={`cursor-pointer duration-500 ${
									open && 'rotate-[360deg]'
								}`}>
								<Logo theme="aim" onClick={() => handleChange()} />
							</span>
						</div>
					</div>

					<div title="Logout" className="flex items-center gap-x-6">
						<div
							title="Network Setting"
							onClick={() => {
								setNetworkSettingState(true);
							}}>
							<NetworkIcon width={1.35} height={1.35} />
						</div>
					</div>
					<div>
						<span
							className="navbar-logout-icon"
							onClick={(e: React.FormEvent) => {
								e.preventDefault();
								setShowModalStr('logout');
								setShowModal(!showModal);
							}}>
							<LogoutIcon />
						</span>
					</div>
				</div>
				{/* <div
					className={`relative duration-300
					${!open ? 'w-16' : 'w-full'}`}>
					<Show when={open}>
						<SidebarResponsive />
					</Show>
				</div> */}
			</div>
		</nav>
	);
};

export default Header;
