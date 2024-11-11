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
import { DecodedUser } from "./types/auth";
import JobListPage from "./pages/jobs/JobListPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import CreateJobPage from "./pages/jobs/CreateJobPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"job_seeker" | "company" | "admin">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
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

// Create a new component to handle the routes
const AppContent = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext must be used within AuthProvider");
  const { user } = auth;
  console.log(user);
  return (
    <>
      <Navbar />
      <div className="main-layout">
        <Routes>
          {/* Public Routes */}
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

            {/* Job Seeker Routes */}
            <Route
              path="jobseeker-profile"
              element={
                <ProtectedRoute allowedRoles={["job_seeker"]}>
                  <JobSeekerProfilePage userId={user?.user_id || 0} />
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

            {/* Job Routes */}
            <Route path="jobs" element={<JobListPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route
              path="jobs/create"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <CreateJobPage />
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
