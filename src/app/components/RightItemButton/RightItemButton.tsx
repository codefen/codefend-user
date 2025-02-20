import css from './rightitembutton.module.scss';

export const RightItemButton = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: () => void;
}) => (
  <button className={css['rightItem']} onClick={action}>
    <div className={css['rightImgMock']}></div>
    <div className={css['rightItemContent']}>
      <b>{title}</b>
      <span>{description}</span>
    </div>
  </button>
);
