import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GraduationCap,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ArrowRight,
  School,
  UserCheck,
  Building,
  Activity,
  Award,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      console.error('Dashboard stats error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Platform Statistics Cards - Super Admin focused
  const statCards = [
    {
      title: 'Total Teachers',
      value: stats?.totalStats?.totalTeachers || 8540,
      icon: GraduationCap,
      gradient: 'from-[#6C5CE7] to-[#5A4FCF]',
      change: '+12%',
      changeType: 'increase',
      bgColor: 'bg-purple-50',
      route: '/admin/teachers'
    },
    {
      title: 'Total Schools',
      value: stats?.totalStats?.totalSchools || 1230,
      icon: School,
      gradient: 'from-[#00B4D8] to-[#0077B6]',
      change: '+8%',
      changeType: 'increase',
      bgColor: 'bg-blue-50',
      route: '/admin/schools'
    },
    {
      title: 'Total Job Posts',
      value: stats?.totalStats?.totalJobs || 3220,
      icon: Briefcase,
      gradient: 'from-[#06D6A0] to-[#118AB2]',
      change: '+15%',
      changeType: 'increase',
      bgColor: 'bg-green-50',
      route: '/admin/jobs'
    },
    {
      title: 'Total Applications',
      value: stats?.totalStats?.totalApplications || 14870,
      icon: FileText,
      gradient: 'from-[#90E0EF] to-[#00B4D8]',
      change: '+23%',
      changeType: 'increase',
      bgColor: 'bg-cyan-50',
      route: '/admin/applications'
    }
  ];

  // Platform Activity Stats for chart
  const platformActivityData = [
    { week: 'Week 1', teachers: 42, jobs: 18, applications: 95 },
    { week: 'Week 2', teachers: 58, jobs: 24, applications: 142 },
    { week: 'Week 3', teachers: 35, jobs: 16, applications: 78 },
    { week: 'Week 4', teachers: 67, jobs: 31, applications: 186 },
    { week: 'Week 5', teachers: 45, jobs: 22, applications: 124 },
    { week: 'Week 6', teachers: 52, jobs: 28, applications: 158 }
  ];

  // Recent Platform Activities
  const recentActivities = [
    {
      icon: GraduationCap,
      message: 'Physics teacher registered',
      time: '10 min ago',
      type: 'teacher',
      color: 'text-purple-600'
    },
    {
      icon: School,
      message: 'Delhi Public School posted job',
      time: '20 min ago',
      type: 'job',
      color: 'text-blue-600'
    },
    {
      icon: CheckCircle,
      message: 'Teacher verification completed',
      time: '35 min ago',
      type: 'verification',
      color: 'text-green-600'
    },
    {
      icon: FileText,
      message: 'New application submitted',
      time: '45 min ago',
      type: 'application',
      color: 'text-orange-600'
    },
    {
      icon: Award,
      message: 'Teacher hired successfully',
      time: '1 hour ago',
      type: 'hire',
      color: 'text-emerald-600'
    }
  ];

  // Platform Management Quick Actions
  const quickActions = [
    {
      title: 'Approve Schools',
      pending: 24,
      icon: School,
      color: 'bg-blue-500',
      route: '/admin/schools'
    },
    {
      title: 'Verify Teachers',
      pending: 18,
      icon: UserCheck,
      color: 'bg-purple-500',
      route: '/admin/teachers'
    },
    {
      title: 'Review Reports',
      pending: 7,
      icon: AlertCircle,
      color: 'bg-orange-500',
      route: '/admin/reports'
    },
    {
      title: 'Platform Settings',
      pending: 3,
      icon: Shield,
      color: 'bg-green-500',
      route: '/admin/settings'
    }
  ];

  // Top Hiring Institutions
  const topInstitutions = [
    {
      name: 'Delhi Public School',
      jobsPosted: 45,
      teachersHired: 32,
      logo: 'DPS'
    },
    {
      name: 'Sri Chaitanya College',
      jobsPosted: 38,
      teachersHired: 28,
      logo: 'SCC'
    },
    {
      name: 'Narayana Junior College',
      jobsPosted: 42,
      teachersHired: 35,
      logo: 'NJC'
    },
    {
      name: 'Kendriya Vidyalaya',
      jobsPosted: 29,
      teachersHired: 24,
      logo: 'KV'
    }
  ];

  return (
    <div className="space-y-6 bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your platform overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-gray-200">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-[#6C5CE7] to-[#5A4FCF] hover:from-[#5A4FCF] to-[#4C43D4]">
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Admin Summary Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              {/* Admin Profile */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#6C5CE7] to-[#5A4FCF] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Super Admin</h3>
                <p className="text-sm text-gray-500">Gravity Platform</p>
              </div>

              {/* Platform Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Teachers</span>
                  <span className="font-semibold text-gray-900">{stats?.totalStats?.totalTeachers || 8540}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Schools</span>
                  <span className="font-semibold text-gray-900">{stats?.totalStats?.totalSchools || 1230}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-gray-900">{stats?.totalStats?.activeJobs || 3220}</span>
                </div>
              </div>

              {/* Circular Progress Indicators */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Platform Health</span>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#6C5CE7"
                        strokeWidth="2"
                        strokeDasharray="85, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-700">85%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">User Satisfaction</span>
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#06D6A0"
                        strokeWidth="2"
                        strokeDasharray="92, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-700">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Dashboard Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden border-0 shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 ${stat.bgColor}`}
                  onClick={() => navigate(stat.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2">
                          {stat.changeType === 'increase' ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Platform Activity Chart */}
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Platform Activity Stats</CardTitle>
              <CardDescription className="text-gray-600">Weekly platform activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={platformActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="teachers" 
                      stroke="#6C5CE7" 
                      strokeWidth={3}
                      dot={{ fill: '#6C5CE7', strokeWidth: 2, r: 4 }}
                      name="Teachers Registered"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="jobs" 
                      stroke="#06D6A0" 
                      strokeWidth={3}
                      dot={{ fill: '#06D6A0', strokeWidth: 2, r: 4 }}
                      name="Jobs Posted"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#00B4D8" 
                      strokeWidth={3}
                      dot={{ fill: '#00B4D8', strokeWidth: 2, r: 4 }}
                      name="Applications Submitted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Platform Activities */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Platform Activities</CardTitle>
                  <CardDescription className="text-gray-600">Latest activities on the platform</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/analytics')}>
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Platform Management Quick Actions */}
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Platform Management</CardTitle>
                <CardDescription className="text-gray-600">Quick actions for platform administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <div 
                        key={index}
                        className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => navigate(action.route)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                            <p className="text-xs text-gray-500">Pending: {action.pending}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                            View
                          </Button>
                          <Button size="sm" className="flex-1 text-xs h-7 bg-gradient-to-r from-[#6C5CE7] to-[#5A4FCF]">
                            Approve
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Hiring Institutions */}
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Top Hiring Institutions</CardTitle>
                <CardDescription className="text-gray-600">Most active schools on the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/schools')}>
                <Eye className="w-4 h-4 mr-2" />
                View All Schools
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topInstitutions.map((institution, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#5A4FCF] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{institution.logo}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{institution.name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Jobs Posted</span>
                        <span className="font-medium text-gray-900">{institution.jobsPosted}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Teachers Hired</span>
                        <span className="font-medium text-gray-900">{institution.teachersHired}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;