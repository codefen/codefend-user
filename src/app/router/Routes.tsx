import { Suspense } from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@/app/components/loaders/Loader';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useAdminCompanyStore from '@stores/adminCompany.store';
import {
  AuthPage,
  SignInLayout,
  ConfirmationSignUp,
  FinishSignUpLayout,
  MobileApplication,
  CloudApplicationPanel,
  SourceCodePanel,
  SocialEngineeringPanel,
  SupportPanel,
  PreferencePanel,
  ResellerLeadsLayout,
  ResellerUsersLayout,
  LanPage,
  ProviderPage,
  ProfileProviderLayout,
  OrdersReviewProviders,
  ResellerCompaniesLayout,
  ResellerOrdersLayout,
  SnsPanel,
  WebApplication,
} from '../views/pages';
import {
  IssuePage,
  IssuesCreation,
  IssuesPanel,
  IssuesUpdate,
} from '../views/pages/panel/layouts/issues';
import { PasswordRecovery } from '../views/pages/greyPanel/recovery/PasswordRecovery';
import { TermsAndCondition } from '../views/pages/help-center/TermsAndCondition';
import { HelpCenter } from '../views/pages/help-center/HelpCenter';
import { SecurityAndPrivacyPolicy } from '../views/pages/help-center/SecurityAndPrivacyPolicy';
import { HelpNotfound } from '../views/pages/help-center/HelpNotfound';
import { InvitationSignup } from '../views/pages/auth/layouts/InvitationSignup';
import { PageReport } from '@modals/reports/PageReport.tsx';
import ProtectedRoute from './ProtectedRoute';
import { GreyPanel } from '@/app/views/pages/greyPanel/GreyPanel';
import { SignupPage } from '@/app/views/pages/greyPanel/signup/SignupPage';
import { DashboardPage } from '@/app/views/pages/greyPanel/Dashboard/DashboardPage';
import { SigninPage } from '@/app/views/pages/greyPanel/signin/SigninPage';
import AdminCompany from '@/app/views/pages/greyPanel/AdminCompany/AdminCompany';
import { ScopePage } from '@/app/views/pages/greyPanel/Scope/ScopePage';

export const AppRouter = () => {
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
  const { companies } = useAdminCompanyStore();

  const isProviderWithAccess = isProvider() && companies.length > 0 && companies[0] !== null;
  const haveAccessToResources = !isProvider() && !isReseller();
  const haveAccessToSupport = !isProvider() && !isReseller();
  const haveAccessToCreateIssue = isProvider() || isAdmin();
  const allRolesLoggedIn = isProvider() || isReseller() || isAdmin() || isNormalUser();

  const routes = useRoutes([
    {
      path: '/',
      element: <GreyPanel />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute isAllowed={true}>
              {isAdmin() ? (
                <AdminCompany />
              ) : isProvider() ? (
                <Navigate to="/provider/profile" replace />
              ) : isReseller() ? (
                <Navigate to="/reseller/leads" replace />
              ) : (
                <DashboardPage />
              )}
            </ProtectedRoute>
          ),
        },
        // Admin routes
        {
          path: 'companies',
          element: (
            <ProtectedRoute isAllowed={isAdmin() || isProviderWithAccess}>
              <AdminCompany />
            </ProtectedRoute>
          ),
        },
        // Provider routes
        {
          path: 'provider/*',
          element: (
            <ProtectedRoute isAllowed={isProvider()}>
              <ProviderPage />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="profile" replace /> },
            { path: 'profile', element: <ProfileProviderLayout /> },
            { path: 'profile/:view', element: <ProfileProviderLayout /> },
            { path: 'orders', element: <OrdersReviewProviders /> },
            { path: 'orders/:view', element: <OrdersReviewProviders /> },
          ],
        },
        // Reseller routes
        {
          path: 'reseller/*',
          element: (
            <ProtectedRoute isAllowed={isReseller()}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            { path: 'leads', element: <ResellerLeadsLayout /> },
            { path: 'users', element: <ResellerUsersLayout /> },
            { path: 'companies', element: <ResellerCompaniesLayout /> },
            { path: 'orders', element: <ResellerOrdersLayout /> },
          ],
        },
        // Shared routes
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute isAllowed={haveAccessToResources}>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        // Resource routes
        ...(haveAccessToResources || isProviderWithAccess
          ? [
              {
                path: 'scope',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <ScopePage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'web',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <WebApplication />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'mobile',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <MobileApplication />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'cloud',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <CloudApplicationPanel />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'source',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <SourceCodePanel />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'network',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <LanPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'social',
                element: (
                  <ProtectedRoute isAllowed={haveAccessToResources || isProviderWithAccess}>
                    <SocialEngineeringPanel />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'issues/*',
                element: <IssuePage />,
                children: [
                  {
                    index: true,
                    element: (
                      <ProtectedRoute isAllowed={allRolesLoggedIn}>
                        <IssuesPanel />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: 'create',
                    element: (
                      <ProtectedRoute isAllowed={haveAccessToCreateIssue}>
                        <IssuesCreation />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: 'create/:type/:resourceId',
                    element: (
                      <ProtectedRoute isAllowed={haveAccessToCreateIssue}>
                        <IssuesCreation />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: 'create/:type',
                    element: (
                      <ProtectedRoute isAllowed={haveAccessToCreateIssue}>
                        <IssuesCreation />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: ':id',
                    element: (
                      <ProtectedRoute isAllowed={allRolesLoggedIn}>
                        <IssuesUpdate />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
            ]
          : []),
        // Non-reseller routes
        ...(!isReseller()
          ? [
              /*{ path: 'inx', element: <InxPanel /> },*/
              { path: 'sns', element: <SnsPanel /> },
            ]
          : []),
        // Support routes
        ...(haveAccessToSupport
          ? [
              { path: 'cs', element: <SupportPanel /> },
              { path: 'cs/:dad', element: <SupportPanel /> },
              { path: 'preferences', element: <PreferencePanel /> },
            ]
          : []),
        // Auth routes
        { path: 'signup', element: <SignupPage /> },
        { path: 'signin', element: <SigninPage /> },
        { path: 'recovery', element: <PasswordRecovery /> },
        { path: 'recovery/:ref', element: <PasswordRecovery /> },
      ],
    },
    // Report route
    {
      path: 'report/*',
      element: (
        <ProtectedRoute isAllowed={allRolesLoggedIn}>
          <PageReport />
        </ProtectedRoute>
      ),
    },
    // Public routes
    {
      path: 'help/*',
      element: <HelpCenter />,
      children: [
        { path: 'terms-and-condition', element: <TermsAndCondition /> },
        { path: 'security-and-privacy-policy', element: <SecurityAndPrivacyPolicy /> },
        { path: '*', element: <HelpNotfound /> },
      ],
    },
    {
      path: 'auth/*',
      element: <AuthPage />,
      children: [
        { index: true, element: <Navigate to="signin" replace /> },
        { path: 'signin', element: <SignInLayout /> },
        { path: 'signup/invitation', element: <InvitationSignup /> },
        { path: 'signup/invitation/:ref', element: <InvitationSignup /> },
        { path: 'confirmation', element: <ConfirmationSignUp /> },
        { path: 'recovery', element: <PasswordRecovery /> },
        { path: 'recovery/:ref', element: <PasswordRecovery /> },
        { path: 'signup/:ref', element: <FinishSignUpLayout /> },
      ],
    },
  ]);

  return <Suspense fallback={<Loader />}>{routes}</Suspense>;
};
