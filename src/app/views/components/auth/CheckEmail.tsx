import type { FC } from 'react';

interface CheckEmailProps {
  text: string;
  subText: string;
}

const CheckEmail: FC<CheckEmailProps> = ({ text, subText }) => (
  <div className="check-mail">
    <div className="check-mail_img">
      <img src="/codefend/check_email.png" alt="mail-image" decoding="async" loading="lazy" />
    </div>
    <div className="check-mail_text">
      <span>{text}</span>
      <p>{subText}</p>
    </div>
  </div>
);

export default CheckEmail;
