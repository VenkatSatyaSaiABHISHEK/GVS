import React from "react";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  User,
  Users,
  BookOpen,
  Calendar,
  Star,
  MapPin,
  Video,
  Heart,
  ChevronRight,
  Home,
  Sparkles,
  Bookmark,
  ClipboardList,
  CreditCard,
  Settings,
  Menu
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data matching the reference design
const statsData = [
  { title: "Teachers Nearby", value: "85", gradient: "from-[#5B3DF5] to-[#7A5CFF]", icon: MapPin },
  { title: "Active Tutors", value: "1", gradient: "from-[#4FA3F7] to-[#60B7FF]", icon: Users },
  { title: "Upcoming Classes", value: "3", gradient: "from-[#20C997] to-[#34D399]", icon: Calendar },
  { title: "Messages", value: "12", gradient: "from-[#84CC16] to-[#A3E635]", icon: MessageSquare },
];

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

const recommendedTeachers = [
  {
    id: 1,
    name: "Rahul Sharma",
    subject: "Physics Teacher",
    experience: "5 Years Experience",
    rating: 4.6,
    location: "Hyderabad",
    mode: "Online + Offline",
    fee: "₹800/hour",
    description: "Expert in JEE and NEET preparation with proven track record"
  },
  {
    id: 2,
    name: "Priya Singh",
    subject: "Mathematics Teacher",
    experience: "3 Years Experience",
    rating: 4.8,
    location: "Mumbai",
    mode: "Online",
    fee: "₹600/hour",
    description: "Specialized in advanced mathematics and competitive exams"
  },
  {
    id: 3,
    name: "Amit Kumar",
    subject: "Chemistry Teacher",
    experience: "7 Years Experience",
    rating: 4.7,
    location: "Delhi",
    mode: "Offline",
    fee: "₹900/hour",
    description: "Organic chemistry specialist with excellent results"
  }
];

const upcomingClasses = [
  { teacher: "Rahul Sharma", subject: "Physics", date: "Dec 15", time: "10:00 AM", mode: "Online", status: "Scheduled" },
  { teacher: "Priya Singh", subject: "Math", date: "Dec 16", time: "2:00 PM", mode: "Offline", status: "Confirmed" },
  { teacher: "Amit Kumar", subject: "Chemistry", date: "Dec 17", time: "4:00 PM", mode: "Online", status: "Pending" },
];

const recentMessages = [
  { teacher: "Rahul Sharma", message: "Demo class available tomorrow", time: "2 min ago", unread: true },
  { teacher: "Priya Singh", message: "Assignment completed successfully", time: "1 hour ago", unread: false },
  { teacher: "Amit Kumar", message: "Next class rescheduled", time: "3 hours ago", unread: true },
];

const ParentDashboard = () => {
  return (
    <div className="min-h-screen bg-[#F5F6FA] font-inter">
      <div className="flex">
        {/* Sidebar - Exact match to reference */}
        <div className="w-[260px] bg-[#4B2BBF] min-h-screen fixed left-0 top-0">
          {/* Logo Area */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#4B2BBF] font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">GRAVITY</h1>
                <p className="text-purple-200 text-sm">Find Best Tutors</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="px-4 py-6">
            <div className="space-y-2">
              {[
                { icon: Home, label: "Dashboard", active: true },
                { icon: Search, label: "Find Teachers" },
                { icon: Sparkles, label: "Recommended Teachers" },
                { icon: Bookmark, label: "Saved Teachers" },
                { icon: Users, label: "My Tutors" },
                { icon: ClipboardList, label: "Tuition Requests" },
                { icon: MessageSquare, label: "Messages" },
                { icon: Calendar, label: "Demo Classes" },
                { icon: CreditCard, label: "Payments" },
                { icon: Settings, label: "Profile Settings" },
              ].map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[10px] transition-all text-sm font-medium ${
                    item.active 
                      ? "bg-white/15 text-white" 
                      : "text-purple-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="ml-[260px] flex-1">
          {/* Top Navbar - Exact match to reference */}
          <div className="h-[70px] bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Menu className="h-5 w-5 text-[#6B7280]" />
              <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
            </div>
            
            {/* Center - Search Bar */}
            <div className="flex-1 max-w-[400px] mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search teachers, subjects..."
                  className="w-full h-[42px] pl-12 pr-4 bg-[#F1F2F6] border-0 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm"
                />
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-[#6B7280] hover:text-[#111827] transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[#5B3DF5] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">5</span>
              </button>
              
              <button className="relative p-2 text-[#6B7280] hover:text-[#111827] transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[#5B3DF5] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#111827]">Abhi Parent</p>
                  <p className="text-xs text-[#6B7280]">Parent Account</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
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
                    <div className="w-20 h-20 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#111827] mb-1">Abhi Parent</h3>
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
                    {[
                      { text: "Your request has been accepted by 3 Teachers", time: "1 day ago" },
                      { text: "Your request has been accepted by 3 Teachers", time: "1 day ago" },
                      { text: "Your request has been accepted by 3 Teachers", time: "1 day ago" },
                      { text: "Your request has been accepted by 3 Teachers", time: "1 day ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-[#5B3DF5] rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#111827]">{activity.text}</p>
                          <p className="text-xs text-[#6B7280] mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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
                        <p className="text-2xl font-bold text-[#111827]">37</p>
                        <p className="text-sm text-[#6B7280]">Requests Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#20C997]">2</p>
                        <p className="text-sm text-[#6B7280]">Demo Classes</p>
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
                    <button className="text-[#5B3DF5] text-sm font-medium hover:underline flex items-center">
                      View More <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {recommendedTeachers.map((teacher) => (
                      <div key={teacher.id} className="border border-[#E5E7EB] rounded-2xl p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
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
                            teacher.mode === 'Online' ? 'bg-blue-100 text-blue-600' :
                            teacher.mode === 'Offline' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {teacher.mode === 'Online + Offline' ? 'FULLTIME' : teacher.mode.toUpperCase()}
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
                    ))}
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
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;