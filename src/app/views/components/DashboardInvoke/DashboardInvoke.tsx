import { RadarScanner } from '../RadarScaner/RadarScaner';
import css from './dashboardinvoke.module.scss';

export const DashboardInvoke = () => {
  return (
    <div className={css['leftTop']}>
      <RadarScanner />
      <div className={css['leftTopContent']}>
        <h1>Detection of vulnerabilities and threats</h1>
        <p>
          We have not yet detected any vulnerabilities or threats in your systems. As soon as our
          professionals identify one, you and your team will be notified via email.{' '}
          <b>If you wish, you can request ethical hackers to expedite the process.</b>
        </p>
        {/*<button className="btn">invoke hackers</button> */}
      </div>
    </div>
  );
};
