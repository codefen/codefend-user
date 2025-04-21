import { PeopleGroupIcon } from '@icons';
import css from './dashboardcollab.module.scss';

export const DashboardAddCollaborators = () => (
  <div className={css['box-collab-left']}>
    <h2>
      <PeopleGroupIcon />
      Collaborators
    </h2>
    <ul>
      <li>Añada colaboradores a su equipo</li>
      <li>Resuelve las vulnerabilidades de su equipo</li>
      <li>No hay un maximo de colaboradores</li>
      <li className="link">Añade un colaborador</li>
    </ul>
  </div>
);
