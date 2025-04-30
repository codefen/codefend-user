import { PeopleGroupIcon } from '@icons';
import css from './dashboardcollab.module.scss';
import { Link } from 'react-router';
import DashboardCollaborators from '../DashboardCollaborators/DashboardCollaborators';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

interface DashboardAddCollaboratorsProps {
  isLoading: boolean;
  data?: {
    members: Array<any>;
  };
}

export const DashboardAddCollaborators = ({ isLoading, data }: DashboardAddCollaboratorsProps) => {
  const { setIsOpen, setModalId } = useModalStore();

  return (
    <div className={css['box-collab-left']}>
      <div className={css['box-collab-info']}>
        <div className={css['header-row']}>
          <h2>Collaborators</h2>
          <button
            className={css['add-button']}
            onClick={() => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
            }}>
            Añadir colaborador
          </button>
        </div>

        <ul>
          <li>- Añada colaboradores a su equipo</li>
          <li>- Resuelve las vulnerabilidades de su equipo</li>
          <li>- No hay un maximo de colaboradores</li>
        </ul>
      </div>

      <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
    </div>
  );
};
