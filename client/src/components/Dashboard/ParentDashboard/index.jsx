import React from "react";
import { 
  Users,
  Calendar,
  Star,
  MapPin,
  ChevronRight,
  User,
  MessageSquare,
  Loader2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getParentDashboardData, getTutors } from "@/services/tuitionServices";
import ParentLayout from "./ParentLayout";

// Mock chart data (this can stay as it's for visualization)
const chartData = [
  { name: 'Week 01', requests: 30, demos: 25, confirmed: 15 },
  { name: 'Week 02', requests: 45, demos: 35, confirmed: 25 },
  { name: 'Week 03', requests: 35, demos: 30, confirmed: 20 },
  { name: 'Week 04', requests: 50, demos: 40, confirmed: 30 },
  { name: 'Week 05', requests: 40, demos: 35, confirmed: 25 },
  { name: 'Week 06', requests: 60, demos: 45, confirmed: 35 },
  { name: 'Week 07', requests: 55, demos: 50, confirmed: 40 },
  { name: 'Week 08', requests: 70, demos: 55, confirmed: 45 },
  { name: 'Week 09', requests: 65, demos: 60, confirmed: 50 },
  { name: 'Week 10', requests: 80, demos: 65, confirmed: 55 },
];

const ParentDashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["parent-dashboard"],
    queryFn: getParentDashboardData,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch recommended teachers
  const { data: teachersResponse, isLoading: isTeachersLoading } = useQuery({
    queryKey: ["recommended-teachers"],
    queryFn: () => getTutors({ limit: 3 }),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const recommendedTeachers = teachersResponse?.tutors?.slice(0, 3) || teachersResponse?.data?.slice(0, 3) || [];
  
  // Create stats data from API response
  const statsData = [
    { 
      title: "Teachers Nearby", 
      value: isDashboardLoading ? "..." : (dashboardData?.data?.nearbyTeachers || "0"), 
      gradient: "from-[#5B3DF5] to-[#7A5CFF]", 
      icon: MapPin 
    },
    { 
      title: "Active Requests", 
      value: isDashboardLoading ? "..." : (dashboardData?.data?.activeRequests || "0"), 
      gradient: "from-[#4FA3F7] to-[#60B7FF]", 
      icon: Users 
    },
    { 
      title: "Accepted Requests", 
      value: isDashboardLoading ? "..." : (dashboardData?.data?.acceptedRequests || "0"), 
      gradient: "from-[#20C997] to-[#34D399]", 
      icon: Calendar 
    },
    { 
      title: "Total Requests", 
      value: isDashboardLoading ? "..." : (dashboardData?.data?.totalRequests || "0"), 
      gradient: "from-[#84CC16] to-[#A3E635]", 
      icon: MessageSquare 
    },
  ];

  return (
    <ParentLayout>
      <div className="p-6">
            {/* Stats Cards - Exact match to reference */}
            <div className="grid grid-cols-4 gap-5 mb-6">
              {statsData.map((stat, index) => (
                <div key={index} className={`h-[110px] bg-gradient-to-r ${stat.gradient} rounded-2xl p-5 text-white shadow-[0px_8px_24px_rgba(0,0,0,0.06)] flex items-center justify-between`}>
                  <div>
                    <p className="text-sm opacity-90 font-medium">{stat.title}</p>
                    <p className="text-[28px] font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Profile & Activities */}
              <div className="col-span-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                  <div className="text-center">
                    {user?.profilePic ? (
                      <img 
                        src={user.profilePic} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-[#5B3DF5]"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-[#111827] mb-1">{user?.fullName || "Abhi Parent"}</h3>
                    <p className="text-sm text-[#6B7280] mb-4">Parent Account</p>
                    
                    {/* Progress indicators */}
                    <div className="flex justify-center space-x-6 mb-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-orange-600 font-bold text-sm">85%</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Profile</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-green-600 font-bold text-sm">31%</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Active</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-blue-600 font-bold text-sm">7%</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Bookings</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                  <h3 className="text-lg font-semibold text-[#111827] mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {isDashboardLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-[#5B3DF5]" />
                      </div>
                    ) : dashboardData?.data?.recentApplications?.length > 0 ? (
                      dashboardData.data.recentApplications.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-[#5B3DF5] rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[#111827]">
                              Applied to {activity.job?.title || 'a position'} 
                              {activity.job?.postedBy?.fullName && ` by ${activity.job.postedBy.fullName}`}
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              {new Date(activity.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[#6B7280]">No recent activity yet.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Charts & Stats */}
              <div className="col-span-8 space-y-6">
                {/* Tuition Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#111827]">Tuition Stats</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#5B3DF5] rounded-full"></div>
                        <span className="text-sm text-[#6B7280]">Requests Sent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#20C997] rounded-full"></div>
                        <span className="text-sm text-[#6B7280]">Demo Classes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                        <span className="text-sm text-[#6B7280]">Confirmed</span>
                      </div>
                      <select className="border border-[#E5E7EB] rounded-lg px-3 py-1 text-sm">
                        <option>This Month</option>
                        <option>This Week</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-2xl font-bold text-[#111827]">
                          {isDashboardLoading ? "..." : (dashboardData?.data?.totalRequests || "0")}
                        </p>
                        <p className="text-sm text-[#6B7280]">Requests Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#20C997]">
                          {isDashboardLoading ? "..." : (dashboardData?.data?.acceptedRequests || "0")}
                        </p>
                        <p className="text-sm text-[#6B7280]">Accepted</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280]">July 23, 2020</p>
                  </div>

                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F6" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#5B3DF5" 
                        strokeWidth={3} 
                        dot={{ fill: '#5B3DF5', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#5B3DF5', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="demos" 
                        stroke="#20C997" 
                        strokeWidth={3}
                        dot={{ fill: '#20C997', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="confirmed" 
                        stroke="#F59E0B" 
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommended Teachers */}
                <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#111827]">Recommended Teachers</h3>
                    <Link 
                      to="/dashboard/parent/find-teachers"
                      className="text-[#5B3DF5] text-sm font-medium hover:underline flex items-center"
                    >
                      View More <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {isTeachersLoading ? (
                      <div className="col-span-3 flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#5B3DF5]" />
                        <span className="ml-2 text-[#6B7280]">Loading teachers...</span>
                      </div>
                    ) : recommendedTeachers.length > 0 ? (
                      recommendedTeachers.map((teacher) => (
                        <div key={teacher.id} className="border border-[#E5E7EB] rounded-2xl p-4 hover:shadow-lg transition-all">
                          <div className="flex items-center space-x-3 mb-3">
                            {teacher.profileImage ? (
                              <img 
                                src={teacher.profileImage} 
                                alt={teacher.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-[#111827] text-sm">{teacher.name}</h4>
                              <p className="text-xs text-[#6B7280]">{teacher.subject}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#6B7280]">Experience:</span>
                              <span className="font-medium">{teacher.experience}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#6B7280]">Rating:</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="font-medium">{teacher.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#6B7280]">Location:</span>
                              <span className="font-medium">{teacher.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-[#5B3DF5]">{teacher.fee}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              teacher.mode === 'ONLINE' ? 'bg-blue-100 text-blue-600' :
                              teacher.mode === 'OFFLINE' ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {teacher.mode === 'ONLINE + OFFLINE' ? 'FULLTIME' : teacher.mode}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-[#5B3DF5] text-white py-2 px-3 rounded-[20px] text-xs font-medium hover:bg-[#4B2BBF] transition-colors">
                              View Profile
                            </button>
                            <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-3 rounded-[20px] text-xs font-medium hover:bg-gray-50 transition-colors">
                              Book Demo
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-sm text-[#6B7280]">No recommended teachers yet.</div>
                    )}
                  </div>
                </div>

                {/* Featured Companies - Adapted for Teachers */}
                <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#111827]">Featured Teaching Centers</h3>
                    <button className="text-[#5B3DF5] text-sm font-medium hover:underline flex items-center">
                      View More <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4">
                    {[
                      { name: "Byju's Academy", teachers: "21 Teachers" },
                      { name: "Vedantu Center", teachers: "21 Teachers" },
                      { name: "Unacademy Hub", teachers: "21 Teachers" },
                      { name: "Khan Academy", teachers: "21 Teachers" },
                      { name: "Toppr Institute", teachers: "21 Teachers" },
                    ].map((center, index) => (
                      <div key={index} className="border border-[#E5E7EB] rounded-2xl p-4 text-center hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                        <h4 className="font-semibold text-[#111827] text-sm mb-1">{center.name}</h4>
                        <p className="text-xs text-[#6B7280]">{center.teachers}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
    </ParentLayout>
  );
};

export default ParentDashboard;
