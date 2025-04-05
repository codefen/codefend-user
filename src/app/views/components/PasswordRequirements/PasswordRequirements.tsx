import type { FC } from 'react';
import { hasLowerCase, hasMinChars, hasStrNumber, hasUpperCase } from '@/app/constants/validations';
import css from './passwordRequirements.module.scss';

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements: FC<PasswordRequirementsProps> = ({ password }) => (
  <div className={css['password-req-container']}>
    <span className={css['password-req-title']}>Password requirements</span>
    <div className={css['password-req-list']}>
      <span className={css['password-req-item']}>
        <span>*</span>{' '}
        <small>
          <div
            className={`${css['dashed-item']} ${hasUpperCase(password) ? css['strike'] : css['no-strike']}`}></div>
          At least 1 uppercase character
        </small>
      </span>
      <span className={css['password-req-item']}>
        <span>*</span>{' '}
        <small>
          <div
            className={`${css['dashed-item']} ${hasLowerCase(password) ? css['strike'] : css['no-strike']}`}></div>
          At least 1 lowercase character
        </small>
      </span>
      <span className={css['password-req-item']}>
        <span>*</span>{' '}
        <small>
          <div
            className={`${css['dashed-item']} ${hasStrNumber(password) ? css['strike'] : css['no-strike']}`}></div>
          At least 1 number
        </small>
      </span>
      {/*
      <span className={css['password-req-item']}>
        <span>*</span>{' '}
        <small>
          <div
            className={`${css['dashed-item']} ${hasSpecialChar(password) ? css['strike'] : css['no-strike']}`}></div>
          At least one special character
        </small>
      </span> */}
      <span className={css['password-req-item']}>
        <span>*</span>{' '}
        <small>
          {' '}
          <div
            className={`${css['dashed-item']} ${hasMinChars(password, 12) ? css['strike'] : css['no-strike']}`}></div>
          At least 12 characters
        </small>
      </span>
    </div>
  </div>
);
