import { useEffect } from 'react';
import { useParams } from 'react-router';
import { cleanHTML, useProviderProfile } from '../../../../../../../data';
import { useProviderSidebar } from '@userHooks/providers/useProviderSidebar.ts';

const ProfileProviderLayout = () => {
  const { view } = useParams();
  const { activeSubOption, setActiveSubOption } = useProviderSidebar();
  const { providerProfile } = useProviderProfile();

  useEffect(() => {
    if (view) {
      if (view.startsWith('about')) {
        setActiveSubOption(0);
      }
      if (view.startsWith('order')) {
        setActiveSubOption(1);
      }
    }
  }, []);

  if (activeSubOption === 0) {
    return (
      <div className="provider-about">
        <div className="about-header">
          <h2>About me:</h2>
        </div>

        <div
          className="about-provider"
          dangerouslySetInnerHTML={{
            __html: cleanHTML(providerProfile?.main_desc),
          }}></div>
      </div>
    );
  }

  return undefined;
};

export default ProfileProviderLayout;
