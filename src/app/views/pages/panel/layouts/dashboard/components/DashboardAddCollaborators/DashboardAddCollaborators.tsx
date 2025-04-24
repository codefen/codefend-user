import { PeopleGroupIcon } from '@icons';
import css from './dashboardcollab.module.scss';
import { Link } from 'react-router';
import DashboardCollaborators from '../DashboardCollaborators/DashboardCollaborators';

interface DashboardAddCollaboratorsProps {
  isLoading: boolean;
  data?: {
    members: Array<any>;
  };
}

export const DashboardAddCollaborators = ({ isLoading, data }: DashboardAddCollaboratorsProps) => (
  <>
    <div className={css['box-collab-left']}>
      <div className={css['box-collab-info']}>
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
      <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
    </div>
  </>
);
