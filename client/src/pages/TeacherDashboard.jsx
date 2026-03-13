import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { getUserApplications, getRecommendedJobsForTeacher } from '@/services/applicationServices';
import { getProfileStrength } from '@/services/profileServices';
import { getUnreadCount, getAllConversations } from '@/services/messageServices';
import { getMyNotifications } from '@/services/notificationServices';
import TeacherLayout from '@/components/Dashboard/TeacherDashboard/TeacherLayout';
import StatsGrid from '@/components/Dashboard/TeacherDashboard/StatsGrid';
import ProfileCard from '@/components/Dashboard/TeacherDashboard/ProfileCard';
import ActivityFeed from '@/components/Dashboard/TeacherDashboard/ActivityFeed';
import PerformanceChart from '@/components/Dashboard/TeacherDashboard/PerformanceChart';
import RecommendedJobs from '@/components/Dashboard/TeacherDashboard/RecommendedJobs';
import FeaturedSchools from '@/components/Dashboard/TeacherDashboard/FeaturedSchools';
import ApplicationTracker from '@/components/Dashboard/TeacherDashboard/ApplicationTracker';
import InterviewManager from '@/components/Dashboard/TeacherDashboard/InterviewManager';
import OfferCenter from '@/components/Dashboard/TeacherDashboard/OfferCenter';
import ProfileStrengthCard from '@/components/Dashboard/TeacherDashboard/ProfileStrengthCard';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [schools, setSchools] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profileStrength, setProfileStrength] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user profile and jobs from existing endpoints
      const [userRes, jobsRes, applicationsRes, recommendedRes, strengthRes, unreadCountRes, conversationsRes, notificationsRes] = await Promise.all([
        axiosInstance.get('/user/current-user').catch(() => ({ data: { user: null } })),
        axiosInstance.get('/jobs/get-all?limit=6').catch(() => ({ data: { jobs: [] } })),
        getUserApplications().catch(() => ({ applications: [] })),
        getRecommendedJobsForTeacher().catch(() => ({ jobs: [] })),
        getProfileStrength().catch(() => null),
        getUnreadCount().catch(() => ({ unreadCount: 0 })),
        getAllConversations().catch(() => ({ conversations: [] })),
        getMyNotifications().catch(() => ({ notifications: [] })),
      ]);

      const user = userRes.data?.user;
      
      const teacherApplications = applicationsRes?.applications || [];
      const pendingApplications = teacherApplications.filter((item) => ['applied', 'application_viewed', 'shortlisted'].includes(item.status)).length;
      const interviewScheduled = teacherApplications.filter((item) => item.status === 'interview_scheduled').length;
      const activeClasses = user?.classesCompleted || 0;

      // Build stats from user data
      setStats({
        applicationsSent: teacherApplications.length,
        pendingApplications,
        activeClasses,
        jobOpportunities: (notificationsRes?.notifications || []).length,
        unreadMessages: unreadCountRes?.unreadCount || 0,
        messagesFromSchools: (conversationsRes?.conversations || []).filter((item) => item.user?.role === 'recruiter').length,
        interviewsScheduled: interviewScheduled,
      });

      // Build profile completion from user data
      const profileFields = ['fullName', 'bio', 'primarySubject', 'qualification', 'city', 'profilePic'];
      const completedFields = profileFields.filter(f => user?.[f]);
      setProfile({
        completionPercentage: Math.round((completedFields.length / profileFields.length) * 100),
        missingFields: profileFields.filter(f => !user?.[f]),
        name: user?.fullName || 'Teacher',
        title: user?.primarySubject || 'Educator',
        avatar: user?.profilePic || '',
      });

      // Static performance data for now
      setPerformanceData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [10, 15, 12, 20, 18, 25],
      });

      setActivities([]);
      setApplications(teacherApplications);
      setJobs((recommendedRes?.jobs && recommendedRes.jobs.length > 0) ? recommendedRes.jobs : (jobsRes.data?.jobs || []));
      setProfileStrength(strengthRes || null);
      setSchools([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      // Set fallback data
      setStats({ applicationsSent: 0, pendingApplications: 0, activeClasses: 0, jobOpportunities: 0, unreadMessages: 0, messagesFromSchools: 0, interviewsScheduled: 0 });
      setProfile({ completionPercentage: 0, missingFields: [], name: 'Teacher', title: 'Educator' });
      setPerformanceData({ labels: [], values: [] });
      setActivities([]);
      setJobs([]);
      setSchools([]);
      setApplications([]);
      setProfileStrength(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsGrid stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Activities */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard profile={profile} />
            <ActivityFeed activities={activities} />
          </div>

          {/* Right Column - Chart & Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart data={performanceData} />
            <ApplicationTracker applications={applications} />
            <InterviewManager applications={applications} />
            <OfferCenter applications={applications} onUpdated={fetchDashboardData} />
            <ProfileStrengthCard strengthData={profileStrength} />
            <RecommendedJobs jobs={jobs} />
            <FeaturedSchools schools={schools} />
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
