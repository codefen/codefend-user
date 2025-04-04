import css from './rightitembutton.module.scss';

export const RightItemButton = ({
  title,
  description,
  action,
  img,
}: {
  title: string;
  description: string;
  img: string;
  action?: () => void;
}) => (
  <button className={css['rightItem']} onClick={action}>
    <img src={img} width={60} height={60} alt="icon" />
    <div className={css['rightItemContent']}>
      <b>{title}</b>
      <span>{description}</span>
    </div>
  </button>
);
