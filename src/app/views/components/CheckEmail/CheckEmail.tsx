import type { FC } from 'react';
import css from './checkemail.module.scss';

interface CheckEmailProps {
  text: string;
  subText: string;
}

const CheckEmail: FC<CheckEmailProps> = ({ text, subText }) => (
  <div className={css['check-mail']}>
    <div className={css['check-mail_img']}>
      <img src="/codefend/icon-mail.png" alt="mail-image" decoding="async" loading="lazy" />
    </div>
    <div className={css['check-mail_text']}>
      <span>{text}</span>
      <p dangerouslySetInnerHTML={{ __html: subText }} />
    </div>
  </div>
);

export default CheckEmail;
