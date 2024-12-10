import { type FC, lazy } from 'react';
import { getCurrentDate } from '@utils/helper';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { AimIcon } from '@icons';
import { useUserData } from '#commonUserHooks/useUserData';

export interface ReportFrontpageProps {
  resourceDomainText: string;
}
const Logo = lazy(() => import('../../../defaults/Logo'));

export const ReportFrontpage: FC<ReportFrontpageProps> = props => {
  const { companySelected } = useAdminCompanyStore();
  const { getUserdata } = useUserData();

  return (
    <div className="portada">
      <div className="codefend-header">
        <div className="date">
          <span>{props.resourceDomainText}</span> - {getCurrentDate()}
        </div>
        <Logo theme="light" />
      </div>
      <div className="aim">
        <AimIcon />
        <h2>CONFIDENTIAL</h2>
      </div>
      <div className="title-portada">
        <p>
          This penetration test on {props.resourceDomainText} was requested by{' '}
          <span>
            {getUserdata().access_role == 'user'
              ? getUserdata().company_name
              : companySelected.name}
          </span>{' '}
          and conducted by Codefend
          {companySelected?.reseller_name &&
          companySelected?.reseller_name?.toLocaleLowerCase?.() !== 'codefend'
            ? ` in collaboration with ${companySelected.reseller_name}`
            : ''}
          .
        </p>
      </div>
    </div>
  );
};
