import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Jobs', href: '/login' },
    { label: 'Teachers', href: '/login' },
    { label: 'Institutions', href: '/register?type=school' },
    { label: 'Courses', href: '/register' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4A7DFF] rounded flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#4A7DFF]">GRAVITY</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-700 hover:text-[#4A7DFF] font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-[#4A7DFF] px-4 py-2"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-white border border-[#4A7DFF] text-[#4A7DFF] hover:bg-[#4A7DFF] hover:text-white px-4 py-2 rounded-full"
            >
              Register
            </Button>
            <Button
              onClick={() => navigate('/register?type=school')}
              className="bg-[#FF7555] hover:bg-[#e55d3f] text-white px-4 py-2 rounded-full"
            >
              For Schools
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#4A7DFF] p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-700 hover:text-[#4A7DFF] font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="justify-start text-gray-700 hover:text-[#4A7DFF]"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="justify-start bg-white border border-[#4A7DFF] text-[#4A7DFF] hover:bg-[#4A7DFF] hover:text-white"
                >
                  Register
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register?type=school');
                    setIsMenuOpen(false);
                  }}
                  className="justify-start bg-[#FF7555] hover:bg-[#e55d3f] text-white"
                >
                  For Schools
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;