import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    subject: '',
    experience: '',
    location: ''
  });
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.subject) params.append('subject', searchData.subject);
    if (searchData.experience) params.append('experience', searchData.experience);
    if (searchData.location) params.append('location', searchData.location);
    
    navigate(`/login?redirect=/dashboard/teacher/jobs&${params.toString()}`);
  };

  return (
    <section className="bg-[#F7F8FC] py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find the Best Teachers for Your{' '}
            <span className="text-[#4A7DFF]">Institution</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Thousands of verified teachers and schools connect on Gravity to build better education careers.
          </p>

          {/* Large Rounded Search Bar - Naukri Style */}
          <div className="bg-white rounded-full shadow-lg p-2 max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              {/* Subject/Skill Input */}
              <div className="md:col-span-1 relative">
                <div className="flex items-center px-4 py-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search subjects / teachers / skills"
                    value={searchData.subject}
                    onChange={(e) => setSearchData({ ...searchData, subject: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Experience Dropdown */}
              <div className="md:col-span-1 relative border-l border-gray-200">
                <div className="flex items-center px-4 py-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                  <select
                    value={searchData.experience}
                    onChange={(e) => setSearchData({ ...searchData, experience: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  >
                    <option value="">Select experience</option>
                    <option value="fresher">Fresher</option>
                    <option value="1+">1+ years</option>
                    <option value="3+">3+ years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </div>

              {/* Location Input */}
              <div className="md:col-span-1 relative border-l border-gray-200">
                <div className="flex items-center px-4 py-3">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-[#4A7DFF] hover:bg-[#3B6EFF] text-white font-semibold py-3 px-6 rounded-full"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Teachers
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Physics Teacher', 'Mathematics Lecturer', 'English Faculty', 'Computer Science', 'Chemistry Teacher'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchData({ ...searchData, subject: term })}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-[#4A7DFF] hover:text-[#4A7DFF] rounded-full transition-colors duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;