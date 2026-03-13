import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import TeacherLayout from './TeacherDashboard/TeacherLayout';
import { formatLocation } from '@/utils/formatLocation';
import { 
  Calendar, Briefcase, Users, Mail, User, CheckCircle, XCircle, 
  MessageCircle, Star, Book, Bell, MapPin, TrendingUp, ChevronRight, Building2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, performanceRes, activitiesRes, profileRes, jobsRes, schoolsRes] = await Promise.all([
        axiosInstance.get('/teacher/dashboard-stats'),
        axiosInstance.get('/teacher/performance-data?period=month'),
        axiosInstance.get('/teacher/recent-activities?limit=10'),
        axiosInstance.get('/teacher/profile-completion'),
        axiosInstance.get('/teacher/recommended-jobs?limit=6'),
        axiosInstance.get('/teacher/featured-schools?limit=10'),
      ]);

      setStats(statsRes.data.stats);
      
      // Transform performance data for recharts
      const perfData = performanceRes.data.data;
      if (perfData && perfData.weeks) {
        const chartData = perfData.weeks.map((week, index) => ({
          week,
          applications: perfData.applications[index] || 0,
          interviews: perfData.interviews[index] || 0,
          classes: perfData.classes[index] || 0,
        }));
        setPerformanceData({ chartData });
      }
      
      setActivities(activitiesRes.data.activities);
      setProfile(profileRes.data.profile);
      setJobs(jobsRes.data.jobs);
      setSchools(schoolsRes.data.schools);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const statsCards = [
    {
      icon: Calendar,
      title: 'Interviews Schedule',
      value: stats?.pendingApplications || 86,
      gradient: 'from-[#6C5DD3] to-[#8B7FE8]',
      bgColor: 'bg-[#6C5DD3]',
    },
    {
      icon: Briefcase,
      title: 'Application Sent',
      value: stats?.applicationsSent || 75,
      gradient: 'from-[#4ECDC4] to-[#6FE4DB]',
      bgColor: 'bg-[#4ECDC4]',
    },
    {
      icon: Users,
      title: 'Profile Viewed',
      value: stats?.jobOpportunities || 45673,
      gradient: 'from-[#2ECC71] to-[#5FE89A]',
      bgColor: 'bg-[#2ECC71]',
    },
    {
      icon: Mail,
      title: 'Unread Message',
      value: stats?.unreadMessages || 93,
      gradient: 'from-[#A0D468] to-[#B8E986]',
      bgColor: 'bg-[#A0D468]',
    },
  ];

  const percentage = profile?.percentage || 85;
  const skills = profile?.skills || [
    { name: 'PHP', level: 66 },
    { name: 'Vue', level: 31 },
    { name: 'Laravel', level: 7 },
  ];

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getIcon = (iconName) => {
    const icons = {
      'check-circle': CheckCircle,
      'x-circle': XCircle,
      calendar: Calendar,
      'message-circle': MessageCircle,
      star: Star,
      book: Book,
      bell: Bell,
    };
    return icons[iconName] || Bell;
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      gray: 'bg-gray-100 text-gray-600',
    };
    return colors[color] || colors.gray;
  };

  return (
    <TeacherLayout>
      <div className="p-8 space-y-6 bg-[#F7F8FC] min-h-screen">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${card.bgColor} bg-opacity-30 rounded-2xl flex items-center justify-center backdrop-blur-sm`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <p className="text-sm font-medium opacity-90 mb-1">{card.title}</p>
                <p className="text-5xl font-bold">{card.value.toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Activities */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-36 h-36 mb-4">
                  <svg className="transform -rotate-90 w-36 h-36">
                    <circle cx="72" cy="72" r={radius} stroke="#E5E7EB" strokeWidth="10" fill="none" />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="#6C5DD3"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Oda Dink</h3>
                <p className="text-sm text-gray-500">Programmer</p>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">{skill.name}</span>
                      <span className="text-gray-500 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-1000 ${
                          index === 0 ? 'bg-[#FF9F43]' : index === 1 ? 'bg-[#2ECC71]' : 'bg-[#4ECDC4]'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {activities && activities.length > 0 ? (
                  activities.slice(0, 4).map((activity, index) => {
                    const Icon = getIcon(activity.icon);
                    return (
                      <div key={activity.id || index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#6C5DD3] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#6C5DD3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                        <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Chart & Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vacancy Stats Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Vacancy Stats</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#6C5DD3] rounded-full"></div>
                    <span className="text-sm text-gray-600">Application Sent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#2ECC71] rounded-full"></div>
                    <span className="text-sm text-gray-600">Interviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FF6B6B] rounded-full"></div>
                    <span className="text-sm text-gray-600">Rejected</span>
                  </div>
                  <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]">
                    <option>This Month</option>
                    <option>This Week</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
              
              {performanceData && performanceData.chartData ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={performanceData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#6C5DD3" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#6C5DD3' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interviews" 
                      stroke="#2ECC71" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#2ECC71' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="classes" 
                      stroke="#FF6B6B" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#FF6B6B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No performance data available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recommended Jobs</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jobs && jobs.length > 0 ? (
                  jobs.slice(0, 3).map((job, index) => (
                    <div 
                      key={index} 
                      className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-gray-800 text-base mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-500 mb-3">{job.schoolName || 'School Name'}</p>
                      
                      <p className="text-lg text-gray-800 font-bold mb-3">
                        {job.salary || '$14,000 - $25,000'}
                      </p>
                      
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {job.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="px-3 py-1 bg-[#6C5DD3] bg-opacity-10 text-[#6C5DD3] rounded-lg text-xs font-semibold">
                          {job.type || 'REMOTE'}
                        </span>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {formatLocation(job.location, 'London, England')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recommended jobs available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Companies */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Featured Companies</h3>
                <button className="flex items-center gap-2 text-[#6C5DD3] text-sm font-semibold hover:gap-3 transition-all">
                  View More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {schools && schools.length > 0 ? (
                  schools.slice(0, 5).map((school, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-48 bg-gray-50 rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center shadow-sm">
                        <Building2 className="w-8 h-8 text-[#6C5DD3]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 mb-1">{school.name}</p>
                      <p className="text-xs text-gray-500">
                        {school.openings} {school.openings === 1 ? 'Vacancy' : 'Vacancy'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-8 text-gray-400">
                    <Book className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No featured companies available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboardOverview;
