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
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";

// Test Page
import TestPage from "./pages/TestPage";

// Admin Components
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminSchools from "./pages/admin/AdminSchools";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import { AdminAuthProvider } from "./hooks/useAdminAuth";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Profile Components
import ProfilePage from "./pages/ProfilePage";
import SchoolProfilePage from "./pages/SchoolProfilePageNew";
import TeacherProfileView from "./pages/TeacherProfileView";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import ParentProfilePage from "./pages/ParentProfilePage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

// School Dashboard Components
import SchoolDashboard from "@/pages/SchoolDashboard";
import SchoolMessages from "@/components/Dashboard/SchoolDashboard/SchoolMessages";
import SearchTeachers from "@/components/Dashboard/SchoolDashboard/SearchTeachers";
import PostJob from "@/components/Dashboard/SchoolDashboard/PostJob";
import JobPosts from "@/components/Dashboard/SchoolDashboard/JobPosts";
import Applications from "@/components/Dashboard/SchoolDashboard/Applications";
import Interviews from "@/components/Dashboard/SchoolDashboard/Interviews";
import SchoolSavedTeachers from "@/components/Dashboard/SchoolDashboard/SavedTeachers";
import Analytics from "@/components/Dashboard/SchoolDashboard/Analytics";
import SchoolJobDetails from "@/components/Dashboard/SchoolDashboard/SchoolJobDetails";
import EditJob from "@/components/Dashboard/SchoolDashboard/EditJob";
import Login from "./pages/Login";
import Settings from "./components/Dashboard/Settings";
import Profile from "./components/Dashboard/Settings/Profile";
import AppliedJobs from "./components/Dashboard/Settings/AppliedJobs";
import Bookmarks from "./components/Dashboard/Settings/Bookmarks";
import AdminDashboardComponent from "./components/Dashboard/AdminDashboard";
import Navbar from "./components/Dashboard/common/Navbar";

// Parent Dashboard Components
import ParentDashboard from "@/components/Dashboard/ParentDashboard/index.jsx";
import FindTeachers from "@/components/Dashboard/ParentDashboard/FindTeachers";
import RecommendedTeachers from "@/components/Dashboard/ParentDashboard/RecommendedTeachers";
import SavedTeachers from "@/components/Dashboard/ParentDashboard/SavedTeachers";
import MyTutors from "@/components/Dashboard/ParentDashboard/MyTutors";
import TuitionRequests from "@/components/Dashboard/ParentDashboard/TuitionRequests";
import Messages from "@/components/Dashboard/ParentDashboard/Messages";
import DemoClasses from "@/components/Dashboard/ParentDashboard/DemoClasses";
import Payments from "@/components/Dashboard/ParentDashboard/Payments";
import ProfileSettings from "@/components/Dashboard/ParentDashboard/ProfileSettings";
import TutorListings from "@/components/Dashboard/JobListings/TutorListings";

// Teacher Dashboard Components
import TeacherDashboard from "@/pages/TeacherDashboard";
import TeacherJobsPanel from "@/components/Dashboard/TeacherJobsPanel";
import TeacherJobDetails from "@/components/Dashboard/TeacherJobDetails";
import TeacherJobApplication from "@/components/Dashboard/TeacherJobApplication";
import TeacherMyClasses from "@/components/Dashboard/TeacherMyClasses";
import TeacherTuitions from "@/components/Dashboard/TeacherTuitions";
import TeacherMessages from "@/components/Dashboard/TeacherMessages";
import TeacherAnalytics from "@/components/Dashboard/TeacherAnalytics";
import ActiveStudentsPanel from "@/components/Dashboard/ActiveStudentsPanel";
import EarningsDashboard from "@/components/Dashboard/EarningsDashboard";
import DemoClassesPanel from "@/components/Dashboard/DemoClassesPanel";
import NotificationsPanel from "@/components/Dashboard/NotificationsPanel";
import TeacherProfile from "@/components/Dashboard/Profile/TeacherProfile";

import CompleteProfilePage from "./pages/CompleteProfilePage";
import ProfileCompletionRoute from "./ProtectedRoutes/ProfileCompletionRoute";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import RoleBasedRoute from "./ProtectedRoutes/RoleBasedRoute";

/** Redirects old /dashboard/settings to the correct role-specific profile page */
const ProfileRedirect = () => {
  const { user } = useAuth();
  const roleMap = {
    teacher: "/dashboard/teacher/profile",
    jobSeeker: "/dashboard/teacher/profile",
    school: "/dashboard/school/profile",
    recruiter: "/dashboard/school/profile",
    parent: "/dashboard/parent/profile-settings",
  };
  return <Navigate to={roleMap[user?.role] || "/dashboard"} replace />;
};

function App() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Map backend roles to frontend route segments
  const roleToRoute = {
    jobSeeker: "teacher",
    recruiter: "school",
    teacher: "teacher",
    school: "school",
    parent: "parent",
    admin: "admin",
  };

  useEffect(() => {
    if (isLoading) return;

    const guestPaths = ["/login", "/register", "/"];
    const isGuestPath = guestPaths.includes(location.pathname);

    if (isAuthenticated && user?.role && isGuestPath) {
      const route = roleToRoute[user.role] || user.role;
      console.log(`Redirecting authenticated user with role ${user.role} to /dashboard/${route}`);
      navigate(`/dashboard/${route}`, { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate, location.pathname, isLoading]);

  // Debug log
  console.log("App render:", { isLoading, isAuthenticated, hasUser: !!user, path: location.pathname });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading... Please wait.</p>
        </div>
      </div>
    );
  }

  const showNavbar = !["/", "/login", "/register"].includes(location.pathname) && 
    !location.pathname.startsWith("/dashboard/teacher") && 
    !location.pathname.startsWith("/dashboard/parent") && 
    !location.pathname.startsWith("/dashboard/school") &&
    !location.pathname.startsWith("/admin");

  return (
    <AdminAuthProvider>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        <Route element={<LoginRegisterLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Complete Profile Route */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CompleteProfilePage />
            </ProtectedRoute>
          }
        />

        {/* School Dashboard Routes - Direct routes without Layout wrapper */}
        <Route
          path="/dashboard/school"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <ProfileCompletionRoute>
                  <SchoolDashboard />
                </ProfileCompletionRoute>
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/search-teachers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <SearchTeachers />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/teacher/:teacherId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <TeacherProfileView />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/post-job"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <PostJob />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/job-posts"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <JobPosts />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/jobs/:jobId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <SchoolJobDetails />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/edit-job/:jobId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <EditJob />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/applications"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <Applications />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/interviews"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <Interviews />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/messages"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <SchoolMessages />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/saved-teachers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <SchoolSavedTeachers />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/analytics"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <Analytics />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="school">
                <SchoolProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/school/settings"
          element={<Navigate to="/dashboard/school/profile" replace />}
        />

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
                <Navigate to={`/dashboard/${roleToRoute[user.role] || user.role}`} replace />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <RefreshCw className="animate-spin h-10 w-10 stroke-primary" />
                </div>
              )
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
            <Route index element={<AdminDashboardComponent />} />
          </Route>

          <Route path="settings" element={<ProfileRedirect />} />
          <Route path="settings/*" element={<ProfileRedirect />} />
        </Route>

        {/* Teacher Dashboard Routes */}
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <ProfileCompletionRoute>
                  <TeacherDashboard />
                </ProfileCompletionRoute>
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/jobs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherJobsPanel />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/jobs/:jobId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherJobDetails />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/jobs/:jobId/apply"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherJobApplication />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/applied-jobs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <AppliedJobs />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/messages"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherMessages />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/analytics"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherAnalytics />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/my-classes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherMyClasses />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/notifications"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <NotificationsPanel />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/tuitions"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherTuitions />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/demo-classes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <DemoClassesPanel />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/active-students"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <ActiveStudentsPanel />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/earnings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <EarningsDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/bookmarks"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <Bookmarks />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/teacher/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="teacher">
                <TeacherProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* Parent Dashboard Routes */}
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <ProfileCompletionRoute>
                  <ParentDashboard />
                </ProfileCompletionRoute>
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/find-teachers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <FindTeachers />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/recommended-teachers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <RecommendedTeachers />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/saved-teachers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <SavedTeachers />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/my-tutors"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <MyTutors />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/tuition-requests"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <TuitionRequests />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/messages"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <Messages />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/demo-classes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <DemoClasses />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/payments"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <Payments />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/profile-settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <ParentProfilePage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/parent/find-tutor"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RoleBasedRoute allowedRole="parent">
                <TutorListings />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
              <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
              <p className="text-sm text-gray-500">Current role: {user?.role || "Unknown"}</p>
              <button 
                onClick={() => navigate("/")} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Home
              </button>
            </div>
          </div>
        } />
        <Route path="/test" element={<TestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="schools" element={<AdminSchools />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
        
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Catch-all - must be last */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
    </AdminAuthProvider>
  );
}

export default App;