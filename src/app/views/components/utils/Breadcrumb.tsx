import { type FC, Fragment } from 'react';
import { useLocation } from 'react-router';
import { useUserData } from '#commonUserHooks/useUserData';
import Show from '@/app/views/components/Show/Show';

interface Props {
  customSegment?: string[];
  root: string;
  rootAction: () => void;
}

export const Breadcrumb: FC<Props> = props => {
  const { getUserdata, company } = useUserData();
  const location = useLocation();

  const defaultSegment = location.pathname.split('/').filter(segment => segment !== '');

  const segments = !props.customSegment ? defaultSegment : props.customSegment;
  return (
    <span className="breadcrumb">
      <Show
        when={
          getUserdata().access_role !== 'provider' ||
          (getUserdata().access_role === 'provider' && company.get?.id !== getUserdata().company_id)
        }>
        <span className="go-home" onClick={props.rootAction}>
          {company.get?.name && company.get?.name !== 'unknow'
            ? company.get.name
            : getUserdata().company_name}
        </span>
        <span className="sep">//</span>
      </Show>
      {segments.map((segment: string, i: number) => (
        <Fragment key={i}>
          {segment}
          <span className="sep">{segments.length - 1 === i ? '' : '//'}</span>
        </Fragment>
      ))}
    </span>
  );
};
