import { type FC } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../../user-profile/userprofile.scss';
import './admin-section.scss';

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
          <div className="card custom-card">
            {/* Contenido del primer recuadro */}
          </div>
          <div className="card custom-card">
            {/* Contenido del segundo recuadro */}
          </div>
        </div>
      </section>
      <section className="right">
        <div className="card custom-card">
          {/* Contenido de la sección derecha */}
        </div>
      </section>
    </main>
  );
};

export default AdminSection; 