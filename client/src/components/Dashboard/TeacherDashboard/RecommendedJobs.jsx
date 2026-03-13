import React from 'react';
import { MapPin, Clock, Briefcase, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatLocation } from '@/utils/formatLocation';

const RecommendedJobs = ({ jobs }) => {
  const navigate = useNavigate();

  const toDisplayText = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed || fallback;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      const parts = value
        .map((item) => toDisplayText(item, ''))
        .filter(Boolean);
      return parts.length ? parts.join(', ') : fallback;
    }
    if (typeof value === 'object') {
      if ('city' in value || 'state' in value || 'country' in value) {
        return formatLocation(value, fallback);
      }
      const parts = Object.values(value)
        .map((item) => toDisplayText(item, ''))
        .filter(Boolean);
      return parts.length ? parts.join(', ') : fallback;
    }
    return fallback;
  };

  // Mock data if none provided
  const recommendedJobs = jobs || [
    {
      id: 1,
      title: 'Physics Teacher',
      school: 'Delhi Public School',
      location: 'New Delhi',
      salary: '₹45,000 - ₹60,000',
      type: 'Full-time',
      posted: '2 days ago',
      requirements: ['B.Sc Physics', '2+ years experience', 'CBSE curriculum'],
      match: 95
    },
    {
      id: 2,
      title: 'Mathematics Teacher',
      school: 'Ryan International School',
      location: 'Mumbai',
      salary: '₹40,000 - ₹55,000',
      type: 'Full-time',
      posted: '1 day ago',
      requirements: ['M.Sc Mathematics', '3+ years experience', 'ICSE curriculum'],
      match: 88
    },
    {
      id: 3,
      title: 'Chemistry Teacher',
      school: 'Kendriya Vidyalaya',
      location: 'Bangalore',
      salary: '₹35,000 - ₹50,000',
      type: 'Part-time',
      posted: '3 days ago',
      requirements: ['M.Sc Chemistry', '1+ years experience', 'NCERT curriculum'],
      match: 82
    },
    {
      id: 4,
      title: 'Science Teacher',
      school: 'DAV Public School',
      location: 'Pune',
      salary: '₹38,000 - ₹52,000',
      type: 'Full-time',
      posted: '4 days ago',
      requirements: ['B.Ed Science', '2+ years experience', 'State board'],
      match: 78
    }
  ];

  const getMatchColor = (match) => {
    if (match >= 90) return 'bg-green-100 text-green-800';
    if (match >= 80) return 'bg-blue-100 text-blue-800';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleJobClick = (jobId) => {
    navigate(`/dashboard/teacher/jobs/${jobId}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Recommended Jobs</h3>
          <p className="text-sm text-gray-500">Jobs matching your profile and preferences</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/teacher/jobs')}
          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {recommendedJobs.slice(0, 4).map((job) => (
          <div 
            key={job.id}
            onClick={() => handleJobClick(job.id)}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-purple-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                    {toDisplayText(job.title, 'Untitled Job')}
                  </h4>
                  <p className="text-sm text-gray-600">{toDisplayText(job.school, 'School')}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(job.match)}`}>
                {toDisplayText(job.match, 0)}% match
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{formatLocation(job.location)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>{toDisplayText(job.type, 'Not specified')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{toDisplayText(job.posted, 'Recently')}</span>
              </div>
              <div className="font-medium text-gray-800">
                {toDisplayText(job.salary, 'Salary not specified')}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {(Array.isArray(job.requirements) ? job.requirements : []).slice(0, 2).map((req, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  {toDisplayText(req, 'Requirement')}
                </span>
              ))}
              {(Array.isArray(job.requirements) ? job.requirements.length : 0) > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{(Array.isArray(job.requirements) ? job.requirements.length : 0) - 2} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendedJobs.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No recommended jobs available</p>
          <p className="text-sm text-gray-400 mt-1">Complete your profile to get better recommendations</p>
        </div>
      )}
    </div>
  );
};

export default RecommendedJobs;