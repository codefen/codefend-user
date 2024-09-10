import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
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
import { RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';
import { useSolvedComunique } from '@hooks/useSolvedComunique';
import './welcome.scss';

interface WelcomeLoadResourceProps {
  close: () => void;
}
const getPath = (alias: string): string => {
  if (alias == RESOURCE_CLASS_ALIAS.WEB) return 'web';
  if (alias == RESOURCE_CLASS_ALIAS.MOBILE) return 'mobile';
  if (alias == RESOURCE_CLASS_ALIAS.CLOUD) return 'cloud';
  if (alias == RESOURCE_CLASS_ALIAS.SOURCE) return 'source';
  if (alias == RESOURCE_CLASS_ALIAS.SOCIAL) return 'social';
  return 'network';
};

const WelcomeLoadResource: FC<WelcomeLoadResourceProps> = ({ close }) => {
  const [selectedAlias, setSelected] = useState('');
  const navigate = useNavigate();
  //const { setModalId, setIsOpen } = useModalStore();

  const navigationTo = () => {
    close();
    navigate(getPath(selectedAlias));
  };
  return (
    <ModalWrapper action={close} type="load-resource">
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
              Please select the type of resource that you would like to analyze:
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
                isDisabled={false}
              />

              <ResourceFigures
                icon={<CLoudIcon />}
                title="Cloud resources"
                click={() => setSelected(RESOURCE_CLASS_ALIAS.CLOUD)}
                isActive={selectedAlias === RESOURCE_CLASS_ALIAS.CLOUD}
                isDisabled={false}
              />

              <ResourceFigures
                icon={<LanIcon />}
                title="Network resources"
                click={() => setSelected(RESOURCE_CLASS_ALIAS.NETWORK)}
                isActive={selectedAlias === RESOURCE_CLASS_ALIAS.NETWORK}
                isDisabled={false}
              />

              <ResourceFigures
                icon={<SourceCodeIcon />}
                title="Code & Smart contracts"
                click={() => setSelected(RESOURCE_CLASS_ALIAS.SOURCE)}
                isActive={selectedAlias === RESOURCE_CLASS_ALIAS.SOURCE}
                isDisabled={false}
              />

              <ResourceFigures
                icon={<PeopleGroupIcon />}
                title="Social resources"
                click={() => setSelected(RESOURCE_CLASS_ALIAS.SOCIAL)}
                isActive={selectedAlias === RESOURCE_CLASS_ALIAS.SOCIAL}
                isDisabled={false}
              />
            </div>

            <div className="welcome-btns">
              <PrimaryButton buttonStyle="black" text="Close" disabledLoader click={close} />
              <PrimaryButton
                text="Add first resource"
                className="load-resource-btn"
                buttonStyle="red"
                disabledLoader
                isDisabled={selectedAlias === ''}
                click={navigationTo}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default WelcomeLoadResource;
