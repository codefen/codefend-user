import {  lazy } from 'react';

/* export { default as AuthPage } from './AuthPage';
export { default as SignUpLayout } from './layouts/Signup';
export { default as SignInLayout } from './layouts/Signin';
 */

export const AuthPage = lazy(() => import('./AuthPage'));
export const SignInLayout = lazy(() => import('./layouts/Signin'));
export const SignUpLayout = lazy(() => import('./layouts/Signup'));
export const ConfirmationSignUp = lazy(
	() => import('./layouts/ConfirmationSignUp'),
);
export const FinishSignUpLayout = lazy(
	() => import('./layouts/FinishsignUp'),
);