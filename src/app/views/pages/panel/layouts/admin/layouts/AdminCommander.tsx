import { type FC } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../../user-profile/userprofile.scss';
import { CreateCompany } from '../components/CreateCompany';
import { DeleteNeuroscans } from '../components/DeleteNeuroscans';
import Navbar from '@/app/views/components/navbar/Navbar';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import useModalStore from '@stores/modal.store.ts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import { PrimaryButton } from '@/app/views/components/buttons/primary/PrimaryButton';

// Componente de Quick Variables
const QuickVariablesCard: FC = () => {
  const isOpenNetworkSetting = useGlobalFastField('isOpenNetworkSetting');

  const handleQuickVariables = () => {
    isOpenNetworkSetting.set(true);
  };

  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Quick variables</h2>
        </div>
        <p>
          Configuración rápida de variables y ajustes del sistema.
        </p>
        <PrimaryButton
          click={handleQuickVariables}
          text="Abrir Variables"
          buttonStyle="send"
          className="form-button"
        />
      </div>
    </div>
  );
};

// Componente de Onboarding
const OnboardingCard: FC = () => {
  const { setIsOpen, setModalId } = useModalStore();
  const isProgressStarted = useGlobalFastField('isProgressStarted');
  const progress = useGlobalFastField('scanProgress');

  const handleOnboarding = () => {
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
    setIsOpen(true);
    isProgressStarted.set(false);
    progress.set(0);
  };

  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Onboarding</h2>
        </div>
        <p>
          Inicia el proceso de bienvenida y configuración inicial del sistema.
        </p>
        <PrimaryButton
          click={handleOnboarding}
          text="Abrir Onboarding"
          buttonStyle="send"
          className="form-button"
        />
      </div>
    </div>
  );
};

// Componente de Quicklinks
const QuicklinksCard: FC = () => {
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Quicklinks</h2>
        </div>
        <p>Accesos rápidos hacia las secciónes de mayor relevancia</p>
        <ul className="quicklinks-list">
          <li>
            <a href="/admin/landers">Landers monitor</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const AdminCommander: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <section className="left">
        <Navbar />
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>Admin Commander</h2>
              <p>Funciones administrativas para gestión de empresas y datos del sistema.</p>
            </div>
          </div>
        </div>
        
        {/* Contenedor fluido para todas las tarjetas */}
        <div className="admin-cards-fluid">
          {/* Crear nueva compañía */}
          <CreateCompany />
          
          {/* Quick variables - arriba de eliminar neuroscans */}
          <QuickVariablesCard />
          
          {/* Eliminar neuroscans - DESACTIVADO */}
          <DeleteNeuroscans />
          
          {/* Onboarding - debajo de crear nueva compañía */}
          <OnboardingCard />
        </div>
      </section>
      
      <section className="right">
        {/* Quicklinks */}
        <QuicklinksCard />
      </section>
    </main>
  );
};

export default AdminCommander; 