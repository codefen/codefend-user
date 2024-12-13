import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const TermsOfUse: FC = () => (
  <div className="margin-top extra-group">
    <span className="text-sm text-alt3 link link-color">
      I have read and accept the{' '}
      <Link to="/help/security-and-privacy-policy" target="_blank">
        <u>security-and-privacy-policy</u>
      </Link>{' '}
      and{' '}
      <Link to="/help/terms-and-condition" target="_blank">
        <u>Terms of Use.</u>
      </Link>
    </span>
  </div>
);
