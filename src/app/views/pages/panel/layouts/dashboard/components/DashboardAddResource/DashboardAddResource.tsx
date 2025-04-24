import { PrimaryButton } from '@buttons/index';
import css from './dashboardresource.module.scss';

export const DashboardAddResource = () => (
  <div className={css['box-assets-right']}>
    <div className={css['info-resource']}>
      <h2>Add resources</h2>
      <p>
        Add resources to help us gain a more complete understanding of your digital environment.
        This allows us to more accurately assess the size and scope of your attack surface, so we
        can design a security strategy that is specifically tailored to your organization’s unique
        needs and risk profile.
      </p>
    </div>
    <PrimaryButton text="go to resources" buttonStyle="red" />
  </div>
);
