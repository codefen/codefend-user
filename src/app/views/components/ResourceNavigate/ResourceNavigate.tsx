import { Link } from 'react-router';
import css from './resourcenav.module.scss';
import { ResourceIconText } from '@/app/views/components/utils/ResourceIconText';

interface ResourceNavigateProps {
  to: string;
  title: string;
  description: string;
  count: number;
  icon: string;
  callback?: () => void;
}

export const ResourceNavigate = ({
  to,
  title,
  description,
  count,
  icon,
  callback,
}: ResourceNavigateProps) => {
  return (
    <Link to={to} className={css['resource-navigate']} onClick={callback}>
      <ResourceIconText resourceClass={icon} />
      <div className={css['resource-navigate-content']}>
        <h2>
          {title} <span>/ {count} resources</span>
        </h2>
        <p>{description}</p>
      </div>
    </Link>
  );
};
