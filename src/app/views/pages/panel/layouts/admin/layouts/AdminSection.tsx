import { type FC } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../../user-profile/userprofile.scss';
import { CreateCompany } from '../components/CreateCompany';
import { DeleteNeuroscans } from '../components/DeleteNeuroscans';

const AdminSection: FC = () => {
  const [showScreen] = useShowScreen();

  return (
    <main className={`user-profile ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <div className="card rectangle">
          <div className="over">
            <div className="header-content">
              <h2>Administration</h2>
              <p>This is a new section for admins.</p>
            </div>
          </div>
        </div>
        <div className="box-assets">
          <DeleteNeuroscans />
          <CreateCompany />
        </div>
      </section>
      <section className="right">
        <div className="card">
          {/* Contenido de la sección derecha */}
        </div>
      </section>
    </main>
  );
};

export default AdminSection; 