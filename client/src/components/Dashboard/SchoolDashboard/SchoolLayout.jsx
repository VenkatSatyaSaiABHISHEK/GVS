import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getMyNotifications } from '@/services/notificationServices';
import {
  Home,
  Search,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  Calendar,
  Briefcase,
  Bookmark,
  Settings,
  Menu,
  LogOut,
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SchoolLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mutate: logoutUser } = logout;

  const { data: notificationsData } = useQuery({
    queryKey: ['school-notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
  });

  const unreadNotifications = notificationsData?.unreadCount || 0;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/school', active: true },
    { icon: Search, label: 'Search Teachers', path: '/dashboard/school/search-teachers' },
    { icon: FileText, label: 'Post Job', path: '/dashboard/school/post-job' },
    { icon: Briefcase, label: 'Job Posts', path: '/dashboard/school/job-posts' },
    { icon: Users, label: 'Applications', path: '/dashboard/school/applications' },
    { icon: Calendar, label: 'Interviews', path: '/dashboard/school/interviews' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/school/messages' },
    { icon: Bookmark, label: 'Saved Teachers', path: '/dashboard/school/saved-teachers' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/school/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/school/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar - Exact match to design */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-[#6C5CE7] to-[#5A4FCF] text-white transition-all duration-300 flex flex-col h-screen sticky top-0 z-50`}
      >
        {/* Logo Section */}
        <div className="p-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#6C5CE7]">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Gravity</h1>
              <p className="text-xs text-purple-200">Hire Best Teachers</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  active
                    ? 'bg-white text-[#6C5CE7] shadow-lg font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings and Logout Section */}
        <div className="p-4 space-y-2 border-t border-white border-opacity-10">
          <Link
            to="/dashboard/school/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={() => logoutUser()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500 hover:bg-opacity-20 transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-xs text-white text-opacity-60">
          <p>Jobie Job Portal Admin Dashboard</p>
          <p className="mt-1">© 2025 All Rights Reserved</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {(() => {
                if (location.pathname.includes('/profile')) return 'Institution Profile';
                if (location.pathname.includes('/search-teachers')) return 'Search Teachers';
                if (location.pathname.includes('/post-job')) return 'Post Job';
                if (location.pathname.includes('/job-posts')) return 'Job Posts';
                if (location.pathname.includes('/applications')) return 'Applications';
                if (location.pathname.includes('/interviews')) return 'Interviews';
                if (location.pathname.includes('/messages')) return 'Messages';
                if (location.pathname.includes('/saved-teachers')) return 'Saved Teachers';
                if (location.pathname.includes('/analytics')) return 'Analytics';
                if (location.pathname.includes('/settings')) return 'Settings';
                return 'Dashboard';
              })()}
            </h2>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={location.pathname.includes('/profile') 
                  ? "Search teachers, subjects, applications..." 
                  : "Search teachers, subjects, skills..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent transition-all"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link 
              to="/dashboard/school/notifications"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6C5CE7] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            </Link>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-xl p-2 transition-colors">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.fullName || 'Green Valley High School'}
                    </p>
                    <p className="text-xs text-gray-500">CBSE Affiliated</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/school/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Institution Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/school/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutUser()} className="flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SchoolLayout;