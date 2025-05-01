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
    <>
      <div className={css['box-collab-left']}>
        <div className={css['box-collab-info']}>
          <div
            className="title"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>
              <PeopleGroupIcon />
              Collaborators
            </h2>
            {/* Enlace "Añadir colaborador" alineado a la derecha */}
            <span
              className={css['link']}
              onClick={() => {
                setIsOpen(true);
                setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
              }}
              style={{ color: 'red', cursor: 'pointer', marginLeft: '20px' }}>
              Añadir colaborador
            </span>
          </div>
          <ul>
            <li>- Añada colaboradores a su equipo</li>
            <li>- Resuelve las vulnerabilidades de su equipo</li>
            <li>- No hay un máximo de colaboradores</li>
          </ul>
        </div>
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </div>
    </>
  );
};
