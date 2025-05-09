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
    <div className="card">
      <div className="over">
        <div className="table-title">
          <h2>Collaborators</h2>
          <a
            className="link"
            onClick={() => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_COLLABORATOR);
            }}>
            Add collaborator
          </a>
        </div>
        <p>
          Add collaborators to your company and resolve vulnerabilities as a team, there is no limit
          to the number of collaborators.
        </p>
        <DashboardCollaborators isLoading={isLoading} members={data?.members || []} />
      </div>
    </div>
  );
};
