import { type FC, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGetUserRegistrations } from '@userHooks/admins/useGetUserRegistrations';
import '../../user-profile/userprofile.scss';
import { CreateCompany } from '../components/CreateCompany';
import { DeleteNeuroscans } from '../components/DeleteNeuroscans';
import { ActivityStats } from '../components/ActivityStats';
import Navbar from '@/app/views/components/navbar/Navbar';

const AdminCommander: FC = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { totals, fetchRegistrations } = useGetUserRegistrations();

  // Cargar datos para las estadísticas
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

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
        
        {/* Estadísticas de actividad */}
        <div className="card standard">
          <div className="over">
            <div className="body">
              <ActivityStats totals={totals} />
            </div>
          </div>
        </div>
      </section>
      
      <section className="right">
        {/* Crear nueva compañía */}
        <CreateCompany />
        
        {/* Eliminar neuroscans - DESACTIVADO */}
        <DeleteNeuroscans />
      </section>
    </main>
  );
};

export default AdminCommander; 