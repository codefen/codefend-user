import type { ResourceCredential } from '@interfaces/creds';
import { useViewCredentials } from '@resourcesHooks/useViewCredentials';
import { TestingCredentialCard } from '@/app/views/components/credential-card/TestingCredentialCard';
import { useEffect, type FC } from 'react';
import './viewcredential.scss';
import { ViewMoreInfoModal } from './ViewMoreInfoModal';
import useCredentialStore from '@stores/credential.store';
import Show from '@/app/views/components/Show/Show';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';
import { PrimaryButton } from '@buttons/index';

interface AddCredentialsProps {
  type: string;
  resourceId: string;
  close: () => void;
}

export const ViewCredentials: FC<AddCredentialsProps> = ({ type, resourceId, close }) => {
  const [credentials, { getCredentials }] = useViewCredentials();
  const { viewMore, setViewMore } = useCredentialStore();
  useEffect(() => {
    getCredentials(type, resourceId);
  }, []);

  return (
    <div className="view-credential">
      <ViewMoreInfoModal
        credential={credentials.find(cred => cred.id == viewMore.id)}
        close={() => setViewMore({ id: '', open: false })}
        isOpen={viewMore.open}
      />
      {credentials.map((cred: ResourceCredential, i: number) => (
        <TestingCredentialCard
          key={`${cred.id}-${i}`}
          username={cred.username || cred.email || ''}
          password={cred.password || ''}
          accessLVL={cred.access_level || ''}
          info={cred.info || ''}
          viewInfo={() => setViewMore({ open: true, id: cred.id })}
        />
      ))}

      <Show when={!Boolean(credentials.length)}>
        <EmptyCard
          title="There are no credentials"
          info="This resource does not have credentials assigned yet"
        />
      </Show>
      <div className="btn-container">
        <PrimaryButton
          text="Close"
          buttonStyle="black"
          className="close-cred-btn"
          click={close}
          disabledLoader
        />
      </div>
    </div>
  );
};
