import { type FC } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../../user-profile/userprofile.scss';
import { CreateCompany } from '../components/CreateCompany';
import { DeleteNeuroscans } from '../components/DeleteNeuroscans';
import Navbar from '@/app/views/components/navbar/Navbar';

// Componente de Quicklinks
const QuicklinksCard: FC = () => {
  return (
    <div className="card standard">
      <div className="over">
        <div className="body">
          <h3>Quicklinks</h3>
          <p>Accesos rápidos hacia las secciónes de mayor relevancia</p>
          <ul className="quicklinks-list">
            <li>
              <a href="/admin/landers">Landers monitor</a>
            </li>
          </ul>
        </div>
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
        
        {/* Contenedor para las dos tarjetas lado a lado */}
        <div className="admin-cards-container">
          {/* Crear nueva compañía */}
          <CreateCompany />
          
          {/* Eliminar neuroscans - DESACTIVADO */}
          <DeleteNeuroscans />
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