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
import { PageReport } from './views/components/modals/reports/components/PageReport';

export const AppRouter: React.FC = () => {
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
						<Route index element={<Dashboard />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="web" element={<WebApplication />} />
						<Route path="mobile" element={<MobileApplication />} />
						<Route path="cloud" element={<CloudApplicationPanel />} />
						{/* <Route path="lan" element={<LanApplicationPanel />} /> */}
						<Route path="source" element={<SourceCodePanel />} />

						<Route path="social" element={<SocialEngineeringPanel />} />
						<Route path="enp" element={<EnpPanel />} />
						<Route path="enp/:id" element={<EnpSingle />} />
						<Route path="support" element={<SupportPanel />} />
						<Route path="preferences" element={<PreferencePanel />} />
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
							<Route path="update/:id" element={<IssuesUpdate />} />
						</Route>
						{/* Private Routes + only admin access */}
						<Route path="admin/*" element={<AdminPage />}>
							<Route index element={<Navigate to="company" replace />} />
							<Route path="company" element={<AdminCompany />} />
						</Route>
					</Route>
					<Route path="report/*" element={<PageReport />}>
						<Route index element={<PageReport />}></Route>
					</Route>
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
