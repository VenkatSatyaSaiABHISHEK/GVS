import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#4A7DFF] rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold">GRAVITY</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting qualified teachers with educational institutions across India. 
              Building better education careers through technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#4A7DFF] transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#4A7DFF] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#4A7DFF] transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#4A7DFF] transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Platform Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">Find Teachers</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Browse Jobs</Link></li>
              <li><Link to="/register?type=school" className="text-gray-400 hover:text-white transition-colors text-sm">For Institutions</Link></li>
              <li><Link to="/register?type=school" className="text-gray-400 hover:text-white transition-colors text-sm">Post a Job</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm cursor-default">About Us</span></li>
              <li><span className="text-gray-400 text-sm cursor-default">Careers</span></li>
              <li><span className="text-gray-400 text-sm cursor-default">Blog</span></li>
              <li><a href="mailto:support@gravity.com" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              <li><a href="mailto:support@gravity.com" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
            </ul>
          </div>

          {/* Legal & Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal & Support</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm cursor-default">Privacy Policy</span></li>
              <li><span className="text-gray-400 text-sm cursor-default">Terms of Service</span></li>
              <li><a href="mailto:support@gravity.com" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a></li>
            </ul>
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm"><Mail className="w-4 h-4" /><span>support@gravity.com</span></div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm"><Phone className="w-4 h-4" /><span>+91 9876543210</span></div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm"><MapPin className="w-4 h-4" /><span>Hyderabad, India</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm"> 2026 GRAVITY Teacher Hiring Platform. All rights reserved.</div>
            <div className="flex space-x-6 text-sm">
              <span className="text-gray-400">Sitemap</span>
              <span className="text-gray-400">Accessibility</span>
              <span className="text-gray-400">Cookie Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
