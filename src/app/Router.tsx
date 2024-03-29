import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from './views/components';
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
	/* LanApplicationPanel,*/
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
import { PageReport } from './views/components/modals/reports/PageReport';
import { ProviderPage } from './views/pages/panel/layouts/providers/ProviderPanel';
import { useAuthState, useUserAdmin, useUserProvider } from './data';
import { ProfileProviderLayout } from './views/pages/panel/layouts/providers/layouts/profile-provider/ProfileProviderLayout';
import { OrdersReviewProviders } from './views/pages/panel/layouts/providers/layouts/orders-provider/OrdersProviderLayout';

export const AppRouter: React.FC = () => {
	const { isAdmin } = useUserAdmin();
	const { isHacker } = useUserProvider();
	const { getAccessToken } = useAuthState();

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
						{isAdmin() && (
							<Route path="admin/*" element={<AdminPage />}>
								<Route
									index
									element={<Navigate to="company" replace />}
								/>
								<Route path="company" element={<AdminCompany />} />
							</Route>
						)}

						{isHacker() && (
							<Route path="provider/*" element={<ProviderPage />}>
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
						{!isHacker() && (
							<>
								<Route index element={<Dashboard />} />
								<Route path="dashboard" element={<Dashboard />} />
								<Route path="web" element={<WebApplication />} />
								<Route path="mobile" element={<MobileApplication />} />
								<Route
									path="cloud"
									element={<CloudApplicationPanel />}
								/>
								<Route path="source" element={<SourceCodePanel />} />

								<Route
									path="social"
									element={<SocialEngineeringPanel />}
								/>
								<Route path="enp" element={<EnpPanel />} />
								<Route path="enp/:id" element={<EnpSingle />} />
								<Route path="support" element={<SupportPanel />} />
								<Route
									path="preferences"
									element={<PreferencePanel />}
								/>
								<Route path="inx" element={<InxPanel />} />
								<Route path="sns" element={<SnsPanel />} />
								<Route path="vdb" element={<VdbPanel />} />

								<Route path="issues/*" element={<IssuePage />}>
									<Route index element={<IssuesPanel />} />
									<Route path="create" element={<IssuesCreation />} />
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
					</Route>
					{getAccessToken() && (
						<Route path="report/*" element={<PageReport />}>
							<Route index element={<PageReport />}></Route>
						</Route>
					)}

					{/* Public Routes */}
					<Route path="/auth/*" element={<AuthPage />}>
						<Route index element={<Navigate to="signin" replace />} />
						<Route path="signin" element={<SignInLayout />} />
						<Route path="signup" element={<SignUpLayout />} />
						<Route path="confirmation" element={<ConfirmationSignUp />} />

						<Route path="signup/:ref" element={<FinishSignUpLayout />} />
					</Route>
				</Routes>
			</Suspense>
		</>
	);
};
