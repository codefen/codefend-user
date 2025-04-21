import { PrimaryButton } from '@buttons/index';

export const DashboardAddResource = () => (
  <div className="box-assets-right">
    <h2>Assets</h2>
    <p>
      Añada recursos para que podamos dimensionar mejor su superficie de ataque y diseñar un plan a
      medida de sus necesidades.
    </p>
    <PrimaryButton text="Add resources" buttonStyle="red" className="full" />
  </div>
);
