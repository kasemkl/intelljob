import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Login from "./pages/authentication/Login";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import AppLayout from "./ui/AppLayout";
import Signup from "./pages/authentication/Signup";
import Settings from "./pages/Settings";
import CompanyProfile from "./pages/CompanyProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobSeekerProfilePage from "./pages/JobSeekerProfile";
import ErrorBoundary from "./components/ErrorBoundary";
import JobListPage from "./pages/jobs/JobListPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import CreateJobPage from "./pages/jobs/CreateJobPage";
import CategoryForm from "./components/CategoryForm";
import JobApplicationsPage from "./pages/jobs/JobApplicationsPage";
import CompanyApplicationsPage from "./pages/jobs/CompanyApplicationsPage";
import ApplicationDetailsPage from "./pages/jobs/ApplicationDetailsPage";
import CompanyJobsPage from "./pages/jobs/CompanyJobsPage";
import EditJobPage from "./pages/jobs/EditJobPage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ApplicationDetailView from "./pages/jobs/ApplicationDetailView";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext must be used within AuthProvider");

  const { user } = auth;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

const AppContent = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext must be used within AuthProvider");
  const { user } = auth;

  return (
    <>
      <Navbar />
      <div className="main-layout">
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about-us" element={<AboutPage />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Common Routes */}
            <Route path="settings" element={<Settings />} />
            <Route path="jobs" element={<JobListPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            {/* Job Seeker Routes */}
            <Route
              path="jobseeker-profile"
              element={
                <ProtectedRoute allowedRoles={["job_seeker"]}>
                  <JobSeekerProfilePage userId={user?.user_id || 0} />
                </ProtectedRoute>
              }
            />
            <Route
              path="applications"
              element={
                <ProtectedRoute allowedRoles={["job_seeker"]}>
                  <JobApplicationsPage />
                </ProtectedRoute>
              }
            />
            {/* Company Routes */}
            <Route
              path="company-profile"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CompanyProfile userId={user?.user_id || 0} />
                </ProtectedRoute>
              }
            />
            <Route
              path="company-jobs"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CompanyJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <EditJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs/create"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CreateJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="company-applications"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CompanyApplicationsPage />
                </ProtectedRoute>
              }
            />
            {/* Application Details Route */}
            <Route
              path="jobs/:jobId/applications"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <ApplicationDetailsPage />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="categories/create"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CategoryForm />
                </ProtectedRoute>
              }
            />
            {/* Application Detail View Route */}
            <Route
              path="applications/:applicationId"
              element={
                <ProtectedRoute allowedRoles={["company", "job_seeker"]}>
                  <ApplicationDetailView />
                </ProtectedRoute>
              }
            />
            {/* Default Route */}
            <Route
              index
              element={
                user?.role === "job_seeker" ? (
                  <Navigate to="/jobseeker-profile" replace />
                ) : user?.role === "company" ? (
                  <Navigate to="/company-profile" replace />
                ) : (
                  <Navigate to="/settings" replace />
                )
              }
            />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ fontSize: "14px" }}
      />
    </>
  );
};

export default App;
