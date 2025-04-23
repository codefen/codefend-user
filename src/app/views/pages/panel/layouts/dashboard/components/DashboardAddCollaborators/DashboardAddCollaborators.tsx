import { PeopleGroupIcon } from '@icons';
import css from './dashboardcollab.module.scss';
import { Link } from 'react-router';

export const DashboardAddCollaborators = () => (
  <div className={css['box-collab-left']}>
    <h2>
      <PeopleGroupIcon />
      Collaborators
    </h2>
    <ul>
      <li>- Añada colaboradores a su equipo</li>
      <li>- Resuelve las vulnerabilidades de su equipo</li>
      <li>- No hay un maximo de colaboradores</li>
      <li className="link">
        <Link to="/">- Añade un colaborador</Link>
      </li>
    </ul>
  </div>
);
