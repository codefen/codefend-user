import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';
import { StarRating } from '@/app/views/components/utils/StarRating';
import useModalStore from '@stores/modal.store';
import { useAppCard } from '@resourcesHooks/useAppCard';
import { defaultMobileCloudResourceAsset } from '@mocks/defaultData';
import { cleanHTML } from '@utils/helper';

interface MobileAppCardProps {
  isActive?: boolean;
  showDetails?: boolean;
  cloudProvider?: any;
  isMainGoogleNetwork?: string | boolean;
  appReviews?: string;
  appRank?: string;
  appDeveloper?: string;
  type?: string;

  id: string;
  name: string;
  appMedia: string;
  appDesc: string;
  openReport?: () => void;
  issueCount?: number;
  activeViewCount?: boolean;
}

function decodeHtml(html: string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export const AppCard: FC<MobileAppCardProps> = ({
  isActive,
  type,
  name,
  showDetails,
  cloudProvider,
  isMainGoogleNetwork,
  id,
  appMedia,
  appDesc,
  appRank,
  appReviews,
  appDeveloper,
  openReport,
  issueCount,
  activeViewCount,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isNormalUser, isProvider } = useUserRole();
  const { isImage, isMobileType, isDetails } = useAppCard({
    type,
    showDetails,
    appMedia,
  });

  const { setModalId, setIsOpen } = useModalStore();

  const handleClick = () => {
    if (isAdmin() || isProvider())
      navigate(
        `/issues/create/${isMobileType ? RESOURCE_CLASS.MOBILE : RESOURCE_CLASS.CLOUD}/${id}`,
        {
          state: { redirect: location.pathname },
        }
      );
  };

  const handleDeleteResource = () => {
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.DELETE_APP);
  };

  const generateCardClasses = () => {
    let classes = 'app-card';
    if (!isDetails) {
      classes += ' app-card-border';
    } else {
      classes += ' app-card-pt';
    }
    if (isActive) {
      classes += ' active';
    }
    return classes;
  };

  const MemoizedRenderImage = () => {
    return !isImage || !isMobileType ? (
      <img
        src={
          Array.from(defaultMobileCloudResourceAsset).includes(name)
            ? `/codefend/${name}.jpg`
            : `/clouds/${cloudProvider ? `${cloudProvider === 'gcp' ? 'google' : cloudProvider}.png` : 'aws.png'}`
        }
        alt="app-image"
        decoding="async"
        loading="lazy"
      />
    ) : (
      <img
        src={`data:image/png;base64,${appMedia}`}
        alt="mobile-image"
        decoding="async"
        loading="lazy"
      />
    );
  };

  return (
    <div className={`${generateCardClasses()}`}>
      <div className="app-card-content">
        <div className="app-card-content-img">{<MemoizedRenderImage />}</div>
        <div className="app-card-content-body">
          <div className="app-card-title">
            <h3
              className={`${isDetails ? 'detail' : 'card-resume'}`}
              dangerouslySetInnerHTML={{
                __html: isMainGoogleNetwork ? 'main google network' : decodeHtml(name),
              }}></h3>
            <Show when={isDetails && !isMobileType}>
              <span className="second-text detail">resource id: {id}</span>
            </Show>
          </div>

          <div className="app-details text-gray">
            <Show
              when={!isMainGoogleNetwork}
              fallback={<span>This is our main GCP network. Please handle with care.</span>}>
              <>
                <p
                  className={`app-details-description ${isMobileType ? 'isMobile' : 'notMobile'} ${
                    isDetails && 'isDetail'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(appDesc ?? ''),
                  }}></p>

                {/* OCULTAR RANKING Y ESTRELLAS SOLO CUANDO ESTAMOS EN isDetails */}

                {isMobileType && !isDetails && (
                  <div className="reviews">
                    {appRank && appRank !== 'unavailable' && <span>{appRank}</span>}
                    {appReviews &&
                      appReviews !== 'unavailable' &&
                      appRank &&
                      appRank !== 'unavailable' && <span>•</span>}
                    {isMobileType && appRank && appRank !== 'unavailable' ? (
                      <StarRating rating={Number(appRank?.replace(',', '.')) || 0} />
                    ) : null}
                  </div>
                )}

                <Show when={isDetails}>
                  <div className="actions" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Show when={isAdmin() || isProvider()}>
                      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                        Add issue
                      </div>
                    </Show>
                    <Show when={isAdmin() || isNormalUser()}>
                      <div onClick={handleDeleteResource} style={{ cursor: 'pointer' }}>
                        Delete
                      </div>
                    </Show>
                    <div
                      onClick={openReport}
                      className={!issueCount || issueCount < 1 ? 'disable-report-action' : ''}
                      style={{ cursor: 'pointer' }}>
                      Credential
                    </div>
                  </div>
                </Show>
              </>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};
