import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Search,
  Sparkles,
  Bookmark,
  Users,
  ClipboardList,
  MessageSquare,
  Calendar,
  CreditCard,
  Settings,
  Menu,
  LogOut,
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';

const ParentLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mutate: logoutUser } = logout;

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/parent' },
    { icon: Search, label: 'Find Teachers', path: '/dashboard/parent/find-teachers' },
    { icon: Sparkles, label: 'Recommended', path: '/dashboard/parent/recommended-teachers' },
    { icon: Bookmark, label: 'Saved Teachers', path: '/dashboard/parent/saved-teachers' },
    { icon: Users, label: 'My Tutors', path: '/dashboard/parent/my-tutors' },
    { icon: ClipboardList, label: 'Tuition Requests', path: '/dashboard/parent/tuition-requests' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/parent/messages' },
    { icon: Calendar, label: 'Demo Classes', path: '/dashboard/parent/demo-classes' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/parent/payments' },
    { icon: User, label: 'Profile', path: '/dashboard/parent/profile-settings' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard/parent') return location.pathname === '/dashboard/parent';
    return location.pathname === path;
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/profile-settings')) return 'Profile Settings';
    if (location.pathname.includes('/find-teachers')) return 'Find Teachers';
    if (location.pathname.includes('/recommended-teachers')) return 'Recommended Teachers';
    if (location.pathname.includes('/saved-teachers')) return 'Saved Teachers';
    if (location.pathname.includes('/my-tutors')) return 'My Tutors';
    if (location.pathname.includes('/tuition-requests')) return 'Tuition Requests';
    if (location.pathname.includes('/messages')) return 'Messages';
    if (location.pathname.includes('/demo-classes')) return 'Demo Classes';
    if (location.pathname.includes('/payments')) return 'Payments';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-[#4B2BBF] to-[#5B3DF5] text-white transition-all duration-300 flex flex-col fixed lg:sticky top-0 h-screen z-50 overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#4B2BBF] font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Gravity</h1>
              <p className="text-xs text-purple-200">Find Best Tutors</p>
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
                    ? 'bg-white text-[#4B2BBF] shadow-lg font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings and Logout */}
        <div className="p-4 space-y-2 border-t border-white border-opacity-10">
          <Link
            to="/dashboard/parent/profile-settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={() => logoutUser()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500 hover:bg-opacity-20 transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-xs text-white text-opacity-60">
          <p>Gravity Tuition Portal</p>
          <p className="mt-1">© 2025 All Rights Reserved</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white h-[70px] shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h2>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F1F2F6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard/parent/messages"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </Link>

            <Link
              to="/dashboard/parent/demo-classes"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-xl p-2 transition-colors"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.fullName || 'Parent'}
                  </p>
                  <p className="text-xs text-gray-500">Parent Account</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/dashboard/parent/profile-settings"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => logoutUser()}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
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

export default ParentLayout;
