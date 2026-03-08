import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  CircleAlert,
  CheckCircle,
  CircleX,
  Info,
  RefreshCw,
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";

import Layout from "./components/Dashboard/common/Layouts/Layout";
import LoginRegisterLayout from "./components/Dashboard/common/Layouts/LoginRegisterLayout";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";

import EmployerDashboard from "@/components/Dashboard/EmployerComponents/EmployerDashboard";
import UserJobListings from "@/components/Dashboard/JobListings";
import JobOpenings from "./components/Dashboard/EmployerComponents/JobOpenings";
import Settings from "./components/Dashboard/Settings";
import Profile from "./components/Dashboard/Settings/Profile";
import AppliedJobs from "./components/Dashboard/Settings/AppliedJobs";
import Bookmarks from "./components/Dashboard/Settings/Bookmarks";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import Navbar from "./components/Dashboard/common/Navbar";
import ParentDashboard from "@/components/Dashboard/ParentDashboard";
import TutorListings from "@/components/Dashboard/JobListings/TutorListings";
import TeacherTuitions from "@/components/Dashboard/TeacherTuitions";
import TeacherDashboardOverview from "@/components/Dashboard/TeacherDashboardOverview";
import ActiveStudentsPanel from "@/components/Dashboard/ActiveStudentsPanel";
import EarningsDashboard from "@/components/Dashboard/EarningsDashboard";
import DemoClassesPanel from "@/components/Dashboard/DemoClassesPanel";
import TeacherJobsPanel from "@/components/Dashboard/TeacherJobsPanel";
import NotificationsPanel from "@/components/Dashboard/NotificationsPanel";
import TeacherMessages from "@/components/Dashboard/TeacherMessages";
import TeacherAnalytics from "@/components/Dashboard/TeacherAnalytics";
import TeacherJobDetails from "@/components/Dashboard/TeacherJobDetails";
import TeacherJobApplication from "@/components/Dashboard/TeacherJobApplication";
import TeacherMyClasses from "@/components/Dashboard/TeacherMyClasses";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import RoleBasedRoute from "./ProtectedRoutes/RoleBasedRoute";
import { useAuth } from "./hooks/useAuth";

function App() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    const guestPaths = ["/", "/login", "/register"];
    const isGuestPath = guestPaths.includes(location.pathname);

    if (isAuthenticated && user?.role && isGuestPath) {
      console.log(`Redirecting authenticated user with role ${user.role} to /dashboard/${user.role}`);
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate, location.pathname, isLoading]);

  if (isLoading)
    return (
      <div className="max-h-screen h-screen w-screen">
        <div className="w-full h-full bg-black/10 flex flex-col gap-5 items-center justify-center">
          <RefreshCw className="animate-spin h-14 w-14 stroke-primary/60" />
          <p className="text-primary/70 text-center font-semibold underline">
            Loading... Please be patient, the backend server is starting up and
            may take a minute.
          </p>
        </div>
      </div>
    );

  const showNavbar = !["/", "/login", "/register"].includes(location.pathname) && !location.pathname.startsWith("/dashboard/teacher") && !location.pathname.startsWith("/dashboard/parent");

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route element={<LoginRegisterLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              user?.role ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <RefreshCw className="animate-spin h-10 w-10 stroke-primary" />
                </div>
              )
            }
          />

          <Route
            path="teacher"
            element={
              <RoleBasedRoute allowedRole="teacher">
                <Dashboard />
              </RoleBasedRoute>
            }
          >
            <Route index element={<TeacherDashboardOverview />} />
            <Route path="jobs" element={<TeacherJobsPanel />} />
            <Route path="jobs/:jobId" element={<TeacherJobDetails />} />
            <Route path="jobs/:jobId/apply" element={<TeacherJobApplication />} />
            <Route path="my-classes" element={<TeacherMyClasses />} />
            <Route path="tuitions" element={<TeacherTuitions />} />
            <Route path="demo-classes" element={<DemoClassesPanel />} />
            <Route path="active-students" element={<ActiveStudentsPanel />} />
            <Route path="earnings" element={<EarningsDashboard />} />
            <Route path="analytics" element={<TeacherAnalytics />} />
            <Route path="messages" element={<TeacherMessages />} />
            <Route path="notifications" element={<NotificationsPanel />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="bookmarks" element={<Bookmarks />} />
          </Route>

          <Route
            path="school"
            element={
              <RoleBasedRoute allowedRole="school">
                <Dashboard />
              </RoleBasedRoute>
            }
          >
            <Route index element={<EmployerDashboard />} />
            <Route path="job-openings" element={<JobOpenings />} />
          </Route>

          <Route
            path="parent"
            element={
              <RoleBasedRoute allowedRole="parent">
                <ParentDashboard />
              </RoleBasedRoute>
            }
          />

          <Route
            path="parent/find-tutor"
            element={
              <RoleBasedRoute allowedRole="parent">
                <TutorListings />
              </RoleBasedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <RoleBasedRoute allowedRole="admin">
                <Dashboard />
              </RoleBasedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="settings" element={<Settings />}>
            <Route index element={<Profile />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
      <Toaster
        icons={{
          success: <CheckCircle />,
          info: <Info />,
          warning: <CircleAlert />,
          error: <CircleX />,
          loading: <RefreshCw className="animate-spin" />,
        }}
      />
    </>
  );
}

export default App;
