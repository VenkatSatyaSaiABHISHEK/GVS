import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  Flag,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  Search,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: GraduationCap, label: 'Teachers', path: '/admin/teachers' },
    { icon: Users, label: 'Schools', path: '/admin/schools' },
    { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
    { icon: FileText, label: 'Applications', path: '/admin/applications' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Flag, label: 'Reports', path: '/admin/reports' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar - Exact match to reference design */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-[#6C5CE7] to-[#5A4FCF] text-white transition-all duration-300 flex flex-col fixed lg:sticky top-0 h-screen z-50 overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="p-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#6C5CE7]">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Gravity</h1>
              <p className="text-xs text-purple-200">Super Admin</p>
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

        {/* Logout Section */}
        <div className="p-4 space-y-2 border-t border-white border-opacity-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500 hover:bg-opacity-20 transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-xs text-white text-opacity-60">
          <p>Gravity Super Admin Panel</p>
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
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h2>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search teachers, schools, jobs..."
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
              <MessageSquare className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                5
              </span>
            </button>

            {/* Admin Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-xl p-2 transition-colors">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {admin?.name || 'Super Admin'}
                    </p>
                    <p className="text-xs text-gray-500">Platform Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center">
                    {admin?.profilePic ? (
                      <img
                        src={admin.profilePic}
                        alt={admin.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/profile">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
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

export default AdminLayout;