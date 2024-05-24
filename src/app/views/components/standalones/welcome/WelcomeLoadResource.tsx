import { useState, type FC } from 'react';
import { ModalWrapper, PrimaryButton } from '../..';
import {
	CLoudIcon,
	GlobeWebIcon,
	LanIcon,
	MobileIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
} from '@icons';
import ResourceFigures from './ResourceFigures';
import '@styles/welcome-guides.scss';
import {
	MODAL_KEY_OPEN,
	RESOURCE_CLASS_ALIAS,
} from '@/app/constants/app-texts';
import { useNavigate } from 'react-router';
import useModalStore from '@stores/modal.store';

interface WelcomeLoadResourceProps {
	close: ()=>void;
}

const WelcomeLoadResource: FC<WelcomeLoadResourceProps> = ({close}) => {
	const [selectedAlias, setSelected] = useState('');
	const navigate = useNavigate();
	const { setModalId, setIsOpen } = useModalStore();

	const navigationTo = () => {
		if (selectedAlias === RESOURCE_CLASS_ALIAS.WEB) {
			close();
			setModalId(MODAL_KEY_OPEN.WEB_WELCOME);
			setIsOpen(true);
			navigate('/web');
		}
	};
	return (
		<ModalWrapper action={()=>{}} type="load-resource">
			<div className="welcome-container">
				<header className="welcome-header">
					<div className="welcome-header-title">
						<img
							src="/codefend/pentest-header-vector.svg"
							alt="codefend-icon"
							aria-label="codefend-icon"
						/>
						<h2>
							<span>Welcome to</span>codefend
						</h2>
						{/*
                            <ActiveProgressiveSteps
								orderStepActive={orderStepActive}
							/>
                            */}
					</div>
				</header>

				<div className="welcome-content">
					<div className="step-header">
						<h3>Let's add your first resource in the system!</h3>
					</div>
					<div className="resource-container">
						<h3 className="sub-title">
							Please select the type of resource that you would like to
							analyze:
						</h3>
						<div className="step-content select-resource-welcome">
							<ResourceFigures
								icon={<GlobeWebIcon />}
								title="Sites o web application"
								click={() => setSelected(RESOURCE_CLASS_ALIAS.WEB)}
								isActive={selectedAlias === RESOURCE_CLASS_ALIAS.WEB}
								isDisabled={false}
							/>
							<ResourceFigures
								icon={<MobileIcon />}
								title="Mobile application"
								click={() => setSelected(RESOURCE_CLASS_ALIAS.MOBILE)}
								isActive={selectedAlias === RESOURCE_CLASS_ALIAS.MOBILE}
								isDisabled={true}
							/>

							<ResourceFigures
								icon={<CLoudIcon />}
								title="Cloud resources"
								click={() => setSelected(RESOURCE_CLASS_ALIAS.CLOUD)}
								isActive={selectedAlias === RESOURCE_CLASS_ALIAS.CLOUD}
								isDisabled={true}
							/>

							<ResourceFigures
								icon={<LanIcon />}
								title="Network resources"
								click={() => setSelected(RESOURCE_CLASS_ALIAS.NETWORK)}
								isActive={
									selectedAlias === RESOURCE_CLASS_ALIAS.NETWORK
								}
								isDisabled={true}
							/>

							<ResourceFigures
								icon={<SourceCodeIcon />}
								title="Code & Smart contracts"
								click={() => setSelected(RESOURCE_CLASS_ALIAS.SOURCE)}
								isActive={selectedAlias === RESOURCE_CLASS_ALIAS.SOURCE}
								isDisabled={true}
							/>

							<ResourceFigures
								icon={<PeopleGroupIcon />}
								title="Social resources"
								click={() => setSelected(RESOURCE_CLASS_ALIAS.SOCIAL)}
								isActive={selectedAlias === RESOURCE_CLASS_ALIAS.SOCIAL}
								isDisabled={true}
							/>
						</div>
						<PrimaryButton
							text="Load resource"
							className="load-resource-btn"
							buttonStyle="red"
							isDisabled={selectedAlias === ""}
							click={navigationTo}
							disabledLoader
						/>
					</div>
				</div>
			</div>
		</ModalWrapper>
	);
};

export default WelcomeLoadResource;
