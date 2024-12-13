import { Suspense, type FC, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Loader } from '@defaults/loaders/Loader.tsx';
import {
  AuthPage,
  SignInLayout,
  SignUpLayout,
  ConfirmationSignUp,
  FinishSignUpLayout,
  Dashboard,
  WebApplication,
  MobileApplication,
  CloudApplicationPanel,
  SourceCodePanel,
  SocialEngineeringPanel,
  SupportPanel,
  PreferencePanel,
  AdminPage,
  AdminCompany,
  ResellerLeadsLayout,
  ResellerUsersLayout,
  LanPage,
  ProviderPage,
  ProfileProviderLayout,
  OrdersReviewProviders,
  ResellerCompaniesLayout,
  ResellerOrdersLayout,
  SnsPanel,
} from './views/pages';
import { PanelPage } from './views/pages/panel/PanelPage';
import { PageReport } from '@modals/reports/PageReport.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { PasswordRecovery } from './views/pages/auth/layouts/PasswordRecovery';
import { TermsAndCondition } from './views/pages/help-center/TermsAndCondition';
import { HelpCenter } from './views/pages/help-center/HelpCenter';
import { SecurityAndPrivacyPolicy } from './views/pages/help-center/SecurityAndPrivacyPolicy';
import { HelpNotfound } from './views/pages/help-center/HelpNotfound';
import { InvitationSignup } from './views/pages/auth/layouts/InvitationSignup';
import {
  IssuePage,
  IssuesCreation,
  IssuesPanel,
  IssuesUpdate,
} from './views/pages/panel/layouts/issues';
import InxPanel from './views/pages/panel/layouts/inx/InxPanel';

const GuardRoute: FC<{ access: boolean; element: ReactNode }> = ({ access, element }) => {
  return access ? element : <Navigate to="/" replace />;
};

export const AppRouter = () => {
  const { isAdmin, isProvider, isReseller, isNormalUser, getAccessToken, isCurrentAuthValid } =
    useUserRole();
  const { companies } = useAdminCompanyStore();
  const haveAccessToResources = !isProvider() && !isReseller();
  const haveAccessToSupport = !isProvider() && !isReseller();
  const haveAccessToCreateIssue = isProvider() || isAdmin();
  const allRolesLoggedIn = isProvider() || isReseller() || isAdmin() || isNormalUser();
  const isProviderWithAccess = isProvider() && companies.length > 0 && companies[0] !== null;

  //false -> !getAccessToken() || !isCurrentAuthValid()
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<PanelPage />}>
          {/* Root page */}
          <Route
            index
            element={
              !getAccessToken() || !isCurrentAuthValid() ? (
                <Navigate to="/auth/signin" replace />
              ) : isAdmin() ? (
                <AdminCompany />
              ) : isProvider() ? (
                <Navigate to="/provider/profile" />
              ) : isReseller() ? (
                <Navigate to="/reseller/leads" />
              ) : (
                <Dashboard />
              )
            }
          />
          {/* Private Routes */}
          {(isAdmin() || isProviderWithAccess) && (
            <Route path="admin/*" element={<AdminPage />}>
              <Route index element={<Navigate to="company" replace />} />
              <Route path="company" element={<AdminCompany />} />
            </Route>
          )}

          {isProvider() && (
            <Route path="provider/*" element={<ProviderPage />}>
              <Route index element={<Navigate to="profile" />} />
              <Route path="profile/" element={<ProfileProviderLayout />} />
              <Route path="profile/:view" element={<ProfileProviderLayout />} />

              <Route path="orders" element={<OrdersReviewProviders />} />
              <Route path="orders/:view" element={<OrdersReviewProviders />} />
            </Route>
          )}
          {isReseller() && (
            <>
              <Route index path="reseller/leads" element={<ResellerLeadsLayout />} />
              <Route path="reseller/users" element={<ResellerUsersLayout />} />
              <Route path="reseller/companies" element={<ResellerCompaniesLayout />} />
              <Route path="reseller/orders" element={<ResellerOrdersLayout />} />
            </>
          )}
          <Route
            path="dashboard"
            element={<GuardRoute element={<Dashboard />} access={haveAccessToResources} />}
          />
          {(haveAccessToResources || isProviderWithAccess) && (
            <>
              <Route path="web" element={<WebApplication />} />
              <Route path="mobile" element={<MobileApplication />} />
              <Route path="cloud" element={<CloudApplicationPanel />} />
              <Route path="source" element={<SourceCodePanel />} />
              <Route path="network" element={<LanPage />} />
              <Route path="social" element={<SocialEngineeringPanel />} />
              <Route path="issues/*" element={<IssuePage />}>
                <Route index element={<IssuesPanel />} />

                <Route
                  path="create"
                  element={
                    <GuardRoute element={<IssuesCreation />} access={haveAccessToCreateIssue} />
                  }
                />
                <Route path="create/:type/:resourceId" element={<IssuesCreation />} />
                <Route path="create/:type" element={<IssuesCreation />} />
                <Route path=":id" element={<IssuesUpdate />} />
              </Route>
            </>
          )}

          {!isReseller() && (
            <>
              <Route path="inx" element={<InxPanel />} />
              <Route path="sns" element={<SnsPanel />} />
              {/*<Route path="enp">
									<Route index element={<EnpPanel />} />
									<Route path="enp/:id" element={<EnpSingle />} />
								</Route>

								
								<Route path="sns" element={<SnsPanel />} />
								<Route path="vdb" element={<VdbPanel />} />*/}
            </>
          )}
          {haveAccessToSupport && (
            <>
              <Route path="cs" element={<SupportPanel />} />
              <Route path="cs/:dad" element={<SupportPanel />} />
              <Route path="preferences" element={<PreferencePanel />} />
            </>
          )}
        </Route>
        {allRolesLoggedIn && (
          <Route path="report/*" element={<PageReport />}>
            <Route index element={<PageReport />}></Route>
          </Route>
        )}

        {/* Public Routes */}
        <Route path="/help/*" element={<HelpCenter />}>
          <Route path="terms-and-condition" element={<TermsAndCondition />} />
          <Route path="security-and-privacy-policy" element={<SecurityAndPrivacyPolicy />} />
          <Route path="*" element={<HelpNotfound />} />
        </Route>
        <Route path="/auth/*" element={<AuthPage />}>
          <Route index element={<Navigate to="signin" replace />} />
          <Route path="signin" element={<SignInLayout />} />
          <Route path="signup" element={<SignUpLayout />} />
          <Route path="signup/invitation" element={<InvitationSignup />} />
          <Route path="signup/invitation/:ref" element={<InvitationSignup />} />
          <Route path="confirmation" element={<ConfirmationSignUp />} />
          <Route path="recovery" element={<PasswordRecovery />} />
          <Route path="recovery/:ref" element={<PasswordRecovery />} />

          <Route path="signup/:ref" element={<FinishSignUpLayout />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
