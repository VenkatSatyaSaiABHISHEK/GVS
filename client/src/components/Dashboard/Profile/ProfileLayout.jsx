import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Search,
  FileText,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  Mail,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mutate: logoutUser } = logout;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: `/dashboard/${{ jobSeeker: 'teacher', recruiter: 'school', teacher: 'teacher', school: 'school', parent: 'parent', admin: 'admin' }[user?.role] || user?.role}` },
    { icon: Search, label: 'Find Jobs', path: '/dashboard/teacher/jobs' },
    { icon: FileText, label: 'Applications', path: '/dashboard/teacher/applied-jobs' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/teacher/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/teacher/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/teacher/profile', active: true },
    { icon: Settings, label: 'Settings', path: '/dashboard/teacher/settings' },
  ];

  const isActive = (path) => location.pathname === path || (path === '/profile' && location.pathname.includes('profile'));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Exact match to reference */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-[#6C5CE7] to-[#5A4FCF] text-white transition-all duration-300 flex flex-col fixed lg:sticky top-0 h-screen z-50 overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="p-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#6C5CE7]">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Jobie</h1>
              <p className="text-xs text-purple-200">Job Portal Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path) || item.active;
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

        {/* Logout Section */}
        <div className="p-4 border-t border-white border-opacity-10">
          <button
            onClick={() => logoutUser()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500 hover:bg-opacity-20 transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar - Exact match */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search teachers, jobs, schools..."
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
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6C5CE7] rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </span>
            </button>

            {/* Messages */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Mail className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                5
              </span>
            </button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profilePic} />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {user?.fullName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || 'User'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutUser()} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
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

export default ProfileLayout;