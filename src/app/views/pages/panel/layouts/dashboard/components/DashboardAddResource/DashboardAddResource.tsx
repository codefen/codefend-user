import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import DashboardAssets from '@/app/views/components/DashboardAssets/DashboardAssets';
import { useDashboard } from '@panelHooks/index';

export const DashboardAddResource = ({}: any | []) => {
  const { data } = useDashboard();
  const { setIsOpen, setModalId } = useModalStore();
  const addResource = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
  };
  return (
    <div className="card">
      <div className="over">
        <div className="table-title">
          <h2>Resources</h2>
          <a className="link" onClick={addResource}>
            Go to resources
          </a>
        </div>
        <p>
          Add resources so we can size your attack surface and design a plan tailored to your needs
        </p>
        <DashboardAssets resources={data?.resources || {}} borderStyle={true} />
      </div>
    </div>
  );
};
