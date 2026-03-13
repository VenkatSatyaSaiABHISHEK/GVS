import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '@/services/messageServices';
import { getMyNotifications } from '@/services/notificationServices';
import {
  Home,
  Search,
  FileText,
  MessageSquare,
  BarChart3,
  Newspaper,
  Settings,
  Menu,
  X,
  LogOut,
  Mail,
  Bell,
  User,
} from 'lucide-react';

const TeacherLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mutate: logoutUser } = logout;

  const { data: unreadData } = useQuery({
    queryKey: ['teacher-unread-messages'],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['teacher-notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
  });

  const unreadMessages = unreadData?.unreadCount || 0;
  const unreadNotifications = notificationsData?.unreadCount || 0;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/teacher', active: true },
    { icon: Search, label: 'Find Jobs', path: '/dashboard/teacher/jobs' },
    { icon: FileText, label: 'Applications', path: '/dashboard/teacher/applied-jobs' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/teacher/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/teacher/analytics' },
    { icon: Newspaper, label: 'My Classes', path: '/dashboard/teacher/my-classes' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F7F8FC] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-[#4B2D8F] to-[#6C5DD3] text-white transition-all duration-300 flex flex-col fixed lg:sticky top-0 h-screen z-50 overflow-hidden rounded-r-[40px]`}
      >
        {/* Logo Section */}
        <div className="p-6 mt-4">
          <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#6C5DD3]">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Gravity</h1>
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
                    ? 'bg-white text-[#6C5DD3] shadow-lg font-semibold'
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
            to="/dashboard/teacher/settings"
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
          <p>Gravity Job Portal</p>
          <p className="mt-1">© 2025 All Rights Reserved</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search something here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent transition-all"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Messages */}
            <Link 
              to="/dashboard/teacher/messages"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Mail className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6C5DD3] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadMessages > 99 ? '99+' : unreadMessages}
              </span>
            </Link>

            {/* Notifications */}
            <Link 
              to="/dashboard/teacher/notifications"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6C5DD3] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            </Link>

            {/* User Profile */}
            <Link 
              to="/dashboard/teacher/settings"
              className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-xl p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C5DD3] to-[#8B7FE8] rounded-full flex items-center justify-center">
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
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.fullName || 'Teacher'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'Teacher'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherLayout;
