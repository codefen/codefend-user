import { useShowScreen } from '#commonHooks/useShowScreen';
import { useFlashlight } from '@/app/views/context/FlashLightContext';
import css from './signup.module.scss';
import DashboardAssets from '@/app/components/DashboardAssets/DashboardAssets';
import { DashboardInvoke } from '@/app/components/DashboardInvoke/DashboardInvoke';

const recoursesEmpty = {
  cloud: '0',
  lan: '0',
  mobile: '0',
  social: '0',
  source: '0',
  web: '0',
};

export const SignupPage = () => {
  const _f = useFlashlight();
  const [showScreen] = useShowScreen();

  return (
    <main className={`${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <DashboardInvoke />
        <DashboardAssets resources={recoursesEmpty} />
      </section>
      <section className="right">
        <button className={css['rightItem']}>
          <div className={css['rightImgMock']}></div>
          <div className={css['rightItemContent']}>
            <b>Add team members</b>
            <span>Send us the first invitation</span>
          </div>
        </button>
        <button className={css['rightItem']}>
          <div className={css['rightImgMock']}></div>
          <div className={css['rightItemContent']}>
            <b>Add scope / attack surface</b>
            <span>You can help us expand the scope.</span>
          </div>
        </button>
      </section>
    </main>
  );
};
