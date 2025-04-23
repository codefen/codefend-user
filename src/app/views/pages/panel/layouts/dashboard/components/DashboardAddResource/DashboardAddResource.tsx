import { PrimaryButton } from '@buttons/index';
import css from './dashboardresource.module.scss';

export const DashboardAddResource = () => (
  <div className={css['box-assets-right']}>
    <div className={css['info-resource']}>
      <h2>Add resources</h2>
      <p>
        Add resources so we can better size your attack surface and design a plan tailored to your
        needs.
      </p>
    </div>
    <PrimaryButton text="go to resources" buttonStyle="red" />
  </div>
);
