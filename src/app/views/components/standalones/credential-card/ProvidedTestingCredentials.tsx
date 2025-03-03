import { type FC } from 'react';

import { TestingCredentialCard } from './TestingCredentialCard';
import { ChartIcon } from '@icons';
import Show from '@/app/components/Show/Show';
import EmptyCard from '@/app/components/EmptyCard/EmptyCard';
import useCredentialStore from '@stores/credential.store';
import useModalStore from '@stores/modal.store';
import { ViewMoreInfoModal } from '@modals/credentials/ViewMoreInfoModal';

interface ProvidedTestingCredentialsProps {
  refetch?: () => void;
  isLoading: boolean;
  credentials: any;
  resourceId: string;
  type: string;
}

export const ProvidedTestingCredentials: FC<ProvidedTestingCredentialsProps> = ({
  credentials,
  isLoading,
  resourceId,
  type,
  //refetch,
}) => {
  const { setCredentialType, setResourceId, setViewMore, viewMore } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const handleOpen = () => {
    setIsOpen(true);
    setResourceId(resourceId);
    setCredentialType(type);
    setModalId(type);
  };
  const userCred = (cred: any) => (!cred.username ? cred.email || '---' : cred.username);

  return (
    <>
      <ViewMoreInfoModal
        credential={credentials.find((cred: any) => cred.id == viewMore.id)}
        close={() => setViewMore({ id: '', open: false })}
        isOpen={viewMore.open}
      />
      <div className="card user-list">
        <div className="header">
          <div className="title">
            <div className="icon">
              <ChartIcon />
            </div>
            <span>provided testing credentials</span>
          </div>

          <div className="actions">
            <div onClick={handleOpen}>Add Credentials</div>
          </div>
        </div>
        <div className="list">
          <Show when={!isLoading && credentials.length !== 0}>
            {credentials.map((cred: any, i: number) => (
              <TestingCredentialCard
                key={`${cred.id}-${i}`}
                username={userCred(cred)}
                password={cred.password || '---'}
                accessLVL={cred.access_level || 'Unknown'}
                info={cred.info || ''}
                viewInfo={() => setViewMore({ id: cred.id, open: true })}
              />
            ))}
          </Show>
          <Show when={!isLoading && credentials.length === 0}>
            <EmptyCard info="This resource does not have credentials assigned yet" />
          </Show>
        </div>
      </div>
    </>
  );
};
