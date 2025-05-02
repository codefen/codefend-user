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
          <div className="title">
            <h2>Collaborators</h2>
            <span
              className="link"
              onClick={() => {
                setIsOpen(true);
                setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
              }}>
              Añadir colaborador
            </span>
          </div>
          <p>
            Add collaborators to your company and resolve vulnerabilities as a team, there is no
            limit to the number of collaborators.
          </p>
        </div>
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </div>
    </>
  );
};
