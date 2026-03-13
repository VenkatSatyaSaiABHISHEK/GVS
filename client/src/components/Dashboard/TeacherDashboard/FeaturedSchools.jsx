import React from 'react';
import { MapPin, Users, Star, ChevronRight, Building2, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatLocation } from '@/utils/formatLocation';

const FeaturedSchools = ({ schools }) => {
  const navigate = useNavigate();

  // Mock data if none provided
  const featuredSchools = schools || [
    {
      id: 1,
      name: 'Delhi Public School',
      location: 'New Delhi',
      type: 'CBSE',
      rating: 4.8,
      teachers: 150,
      students: 2500,
      openings: 5,
      logo: null,
      established: 1985,
      facilities: ['Smart Classrooms', 'Science Labs', 'Sports Complex']
    },
    {
      id: 2,
      name: 'Ryan International School',
      location: 'Mumbai',
      type: 'ICSE',
      rating: 4.6,
      teachers: 120,
      students: 2000,
      openings: 3,
      logo: null,
      established: 1990,
      facilities: ['Digital Library', 'Swimming Pool', 'Auditorium']
    },
    {
      id: 3,
      name: 'Kendriya Vidyalaya',
      location: 'Bangalore',
      type: 'CBSE',
      rating: 4.5,
      teachers: 80,
      students: 1500,
      openings: 7,
      logo: null,
      established: 1975,
      facilities: ['Computer Lab', 'Playground', 'Canteen']
    },
    {
      id: 4,
      name: 'DAV Public School',
      location: 'Pune',
      type: 'State Board',
      rating: 4.4,
      teachers: 90,
      students: 1800,
      openings: 2,
      logo: null,
      established: 1988,
      facilities: ['Art Room', 'Music Room', 'Gymnasium']
    },
    {
      id: 5,
      name: 'St. Xavier\'s School',
      location: 'Kolkata',
      type: 'ICSE',
      rating: 4.7,
      teachers: 110,
      students: 1900,
      openings: 4,
      logo: null,
      established: 1960,
      facilities: ['Chapel', 'Laboratory', 'Library']
    }
  ];

  const handleSchoolClick = (schoolId) => {
    // Navigate to school profile or jobs from this school
    navigate(`/dashboard/teacher/jobs?school=${schoolId}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Featured Schools</h3>
          <p className="text-sm text-gray-500">Top-rated schools actively hiring teachers</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/teacher/jobs')}
          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredSchools.slice(0, 6).map((school) => (
          <div 
            key={school.id}
            onClick={() => handleSchoolClick(school.id)}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-purple-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  {school.logo ? (
                    <img src={school.logo} alt={school.name} className="w-8 h-8 rounded" />
                  ) : (
                    <Building2 className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors text-sm">
                    {school.name}
                  </h4>
                  <p className="text-xs text-gray-600">{school.type} • Est. {school.established}</p>
                </div>
              </div>
              {school.openings > 0 && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {school.openings} openings
                </div>
              )}
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{formatLocation(school.location)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{school.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{school.teachers} teachers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>{school.students} students</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Facilities:</p>
              <div className="flex flex-wrap gap-1">
                {school.facilities.slice(0, 2).map((facility, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {facility}
                  </span>
                ))}
                {school.facilities.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    +{school.facilities.length - 2}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button className="text-purple-600 hover:text-purple-700 text-xs font-medium">
                View Profile
              </button>
              <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
                View Jobs
              </button>
            </div>
          </div>
        ))}
      </div>

      {featuredSchools.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No featured schools available</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedSchools;