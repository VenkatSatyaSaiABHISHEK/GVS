import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  FileText,
  MessageSquare,
  BarChart3,
  Newspaper,
  Menu,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout.mutate();
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/teacher' },
    { icon: Search, label: 'Search Job', path: '/dashboard/teacher/jobs' },
    { icon: FileText, label: 'Applications', path: '/dashboard/teacher/applied-jobs' },
    { icon: MessageSquare, label: 'Message', path: '/dashboard/teacher/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/teacher/analytics' },
    { icon: Newspaper, label: 'My Classes', path: '/dashboard/teacher/my-classes' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-600 to-purple-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">G</span>
            </div>
            <span className="text-white font-bold text-xl">Gravity</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-4 space-y-2 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-white text-opacity-80 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <p className="text-white text-opacity-60 text-xs">
            Gravity Job Portal
          </p>
          <p className="text-white text-opacity-60 text-xs">
            © 2026 All Rights Reserved
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
