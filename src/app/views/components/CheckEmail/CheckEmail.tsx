import type { FC } from 'react';
import css from './checkemail.module.scss';

interface CheckEmailProps {
  text?: string;
  subText?: string;
  imgSrc?: string;
}

const CheckEmail: FC<CheckEmailProps> = ({
  text,
  subText,
  imgSrc = '/codefend/email-icon1.png',
}) => {
  const hasImgAndText = !!text && !!subText;
  return (
    <div className={`${css['check-mail']}`} data-img-only={!hasImgAndText}>
      <div className={css['check-mail_img']}>
        <img src={imgSrc} alt="mail-image" decoding="async" loading="lazy" />
      </div>
      {hasImgAndText ? (
        <div className={css['check-mail_text']}>
          <span>{text}</span>
          <p dangerouslySetInnerHTML={{ __html: subText }} />
        </div>
      ) : null}
    </div>
  );
};

export default CheckEmail;
