import { Suspense, type FC, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
	EnpPanel,
	EnpSingle,
	SupportPanel,
	PreferencePanel,
	InxPanel,
	SnsPanel,
	VdbPanel,
	IssuePage,
	IssuesPanel,
	IssuesCreation,
	IssuesUpdate,
	AdminPage,
	AdminUser,
	AdminCompany,
} from './views/pages';
import { PanelPage } from './views/pages/panel/PanelPage';
import { PageReport } from '@modals/reports/PageReport.tsx';
import { ProviderPage } from './views/pages/panel/layouts/providers/ProviderPanel';
import { ProfileProviderLayout } from './views/pages/panel/layouts/providers/layouts/profile-provider/ProfileProviderLayout';
import { OrdersReviewProviders } from './views/pages/panel/layouts/providers/layouts/orders-provider/OrdersProviderLayout';
import { ResellerPage } from './views/pages/panel/layouts/reseller/ResellerPage';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import LanPage from './views/pages/panel/layouts/lan/Lan';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { PasswordRecovery } from './views/pages/auth/layouts/PasswordRecovery';
import { TermsAndCondition } from './views/pages/help-center/TermsAndCondition';
import { HelpCenter } from './views/pages/help-center/HelpCenter';
import { SecurityAndPrivacyPolicy } from './views/pages/help-center/SecurityAndPrivacyPolicy';
import { HelpNotfound } from './views/pages/help-center/HelpNotfound';

export const AppRouter: React.FC = () => {
	const {
		isAdmin,
		isProvider,
		isReseller,
		getAccessToken,
		isCurrentAuthValid,
	} = useUserRole();
	const { companies } = useAdminCompanyStore();
	const haveAccessToResources = !isProvider() && !isReseller();
	const haveAccessToModules = !isProvider() && !isReseller();
	const haveAccessToSupport = !isProvider() && !isReseller();
	const haveAccessToCreateIssue = isProvider() || isAdmin();
	const isProviderWithAccess =
		isProvider() && companies.length > 0 && companies[0] !== null;

	const GuardRoute: FC<{ access: boolean; element: ReactNode }> = ({
		access,
		element,
	}) => {
		return access ? element : <Navigate to="/" replace />;
	};
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>

			<Suspense fallback={<Loader />}>
				<Routes>
					{/* Private Routes */}
					<Route path="/*" element={<PanelPage />}>
						<Route
							index
							element={
								!getAccessToken().trim() || !isCurrentAuthValid() ? (
									<Navigate to="/auth/signin" replace />
								) : isAdmin() ? (
									<AdminCompany />
								) : isProvider() ? (
									<Navigate to="/provider/profile" />
								) : isReseller() ? (
									<ResellerPage />
								) : (
									<Dashboard />
								)
							}
						/>

						{(isAdmin() || isProviderWithAccess) && (
							<Route path="admin/*" element={<AdminPage />}>
								<Route
									index
									element={<Navigate to="company" replace />}
								/>
								<Route path="company" element={<AdminCompany />} />
							</Route>
						)}

						{isProvider() && (
							<Route path="provider/*" element={<ProviderPage />}>
								<Route index element={<Navigate to="profile" />} />
								<Route
									path="profile/"
									element={<ProfileProviderLayout />}
								/>
								<Route
									path="profile/:view"
									element={<ProfileProviderLayout />}
								/>

								<Route
									path="orders"
									element={<OrdersReviewProviders />}
								/>
								<Route
									path="orders/:view"
									element={<OrdersReviewProviders />}
								/>
							</Route>
						)}
						<Route
							path="reseller/"
							element={
								<GuardRoute
									element={<ResellerPage />}
									access={haveAccessToResources}
								/>
							}
						/>
						<Route
							path="dashboard"
							element={
								<GuardRoute
									element={<Dashboard />}
									access={haveAccessToResources}
								/>
							}
						/>
						{(haveAccessToResources || isProviderWithAccess) && (
							<>
								<Route path="web" element={<WebApplication />} />
								<Route path="mobile" element={<MobileApplication />} />
								<Route
									path="cloud"
									element={<CloudApplicationPanel />}
								/>
								<Route path="source" element={<SourceCodePanel />} />
								<Route path="lan" element={<LanPage />} />
								<Route
									path="social"
									element={<SocialEngineeringPanel />}
								/>
								<Route path="issues/*" element={<IssuePage />}>
									<Route index element={<IssuesPanel />} />

									<Route
										path="create"
										element={
											<GuardRoute
												element={<IssuesCreation />}
												access={haveAccessToCreateIssue}
											/>
										}
									/>
									<Route
										path="create/:type/:resourceId"
										element={<IssuesCreation />}
									/>
									<Route
										path="update/:id"
										element={<IssuesUpdate />}
									/>
								</Route>
							</>
						)}

						{/*haveAccessToModules && (
							<>
								<Route path="enp">
									<Route index element={<EnpPanel />} />
									<Route path="enp/:id" element={<EnpSingle />} />
								</Route>

								<Route path="inx" element={<InxPanel />} />
								<Route path="sns" element={<SnsPanel />} />
								<Route path="vdb" element={<VdbPanel />} />
							</>
						)*/}
						{haveAccessToSupport && (
							<>
								<Route path="support" element={<SupportPanel />} />
								<Route
									path="preferences"
									element={<PreferencePanel />}
								/>
							</>
						)}
					</Route>
					{haveAccessToResources && (
						<Route path="report/*" element={<PageReport />}>
							<Route index element={<PageReport />}></Route>
						</Route>
					)}

					{/* Public Routes */}
					<Route path="/help/*" element={<HelpCenter />}>
						<Route
							path="terms-and-condition"
							element={<TermsAndCondition />}
						/>
						<Route
							path="security-and-privacy-policy"
							element={<SecurityAndPrivacyPolicy />}
						/>
						<Route path="*" element={<HelpNotfound />} />
					</Route>
					<Route path="/auth/*" element={<AuthPage />}>
						<Route index element={<Navigate to="signin" replace />} />
						<Route path="signin" element={<SignInLayout />} />
						<Route path="signup" element={<SignUpLayout />} />
						<Route path="confirmation" element={<ConfirmationSignUp />} />
						<Route path="recovery" element={<PasswordRecovery />} />
						<Route path="recovery/:ref" element={<PasswordRecovery />} />

						<Route path="signup/:ref" element={<FinishSignUpLayout />} />
					</Route>
				</Routes>
			</Suspense>
		</>
	);
};
