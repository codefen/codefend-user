import { type FC, lazy } from 'react';
import { getCurrentDate } from '@utils/helper';
import { AimIcon } from '@icons';
import { useUserData } from '#commonUserHooks/useUserData';

export interface ReportFrontpageProps {
  resourceDomainText: string;
}
const Logo = lazy(() => import('../../../Logo/Logo'));

export const ReportFrontpage: FC<ReportFrontpageProps> = props => {
  const { getUserdata, company } = useUserData();

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
            {getUserdata().access_role == 'user' ? getUserdata().company_name : company.get?.name}
          </span>{' '}
          and conducted by Codefend
          {company.get?.reseller_name &&
          company.get?.reseller_name?.toLocaleLowerCase?.() !== 'codefend'
            ? ` in collaboration with ${company.get.reseller_name}`
            : ''}
          .
        </p>
      </div>
    </div>
  );
};
