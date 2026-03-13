import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import SchoolLayout from './SchoolLayout';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const JobPosts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);

  // Fetch jobs from database
  const { data: jobsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['school-jobs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/jobs/get-recruiter-jobs');
      return response.data;
    },
    retry: false
  });

  const jobPosts = jobsData?.jobs || [];

  const tabs = [
    { id: 'all', label: 'All Jobs', count: jobPosts.length },
    { id: 'open', label: 'Active', count: jobPosts.filter(job => job.status === 'open').length },
    { id: 'closed', label: 'Closed', count: jobPosts.filter(job => job.status === 'closed').length }
  ];

  const filteredJobs = activeTab === 'all' ? jobPosts : jobPosts.filter(job => job.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAction = async (action, jobId) => {
    console.log(`${action} job ${jobId}`);
    
    if (action === 'view') {
      navigate(`/dashboard/school/jobs/${jobId}`);
    } else if (action === 'edit') {
      navigate(`/dashboard/school/edit-job/${jobId}`);
    } else if (action === 'applications') {
      navigate(`/dashboard/school/applications?jobId=${jobId}`);
    } else if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this job?')) {
        try {
          console.log('Deleting job with ID:', jobId);
          console.log('Delete URL:', `/jobs/${jobId}/delete`);
          const response = await axiosInstance.delete(`/jobs/${jobId}/delete`);
          console.log('Delete response:', response);
          toast.success('Job deleted successfully');
          refetch();
        } catch (error) {
          console.error('Delete error:', error);
          console.error('Error response:', error.response);
          toast.error(error.response?.data?.message || 'Failed to delete job');
        }
      }
    }
    
    setShowDropdown(null);
  };

  const handlePostNewJob = () => {
    navigate('/dashboard/school/post-job');
  };

  return (
    <SchoolLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Job Posts</h1>
            <p className="text-gray-600">Manage your job postings and track applications</p>
          </div>
          <button 
            onClick={handlePostNewJob}
            className="bg-[#6C5CE7] text-white px-6 py-3 rounded-xl hover:bg-[#5A4FCF] transition-colors font-medium"
          >
            Post New Job
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#6C5CE7]" />
            <span className="ml-3 text-gray-600">Loading jobs...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Jobs</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
        )}

        {/* Stats Cards */}
        {!isLoading && !isError && (
          <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-800">{jobPosts.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#6C5CE7] bg-opacity-10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#6C5CE7]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{jobPosts.filter(job => job.status === 'open').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{jobPosts.reduce((sum, job) => sum + (job.applicants?.length || 0), 0)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Closed Jobs</p>
                <p className="text-2xl font-bold text-orange-600">{jobPosts.filter(job => job.status === 'closed').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#6C5CE7] border-b-2 border-[#6C5CE7]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Job Posts List */}
          <div className="p-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === 'all' ? 'You haven\'t posted any jobs yet.' : `No ${activeTab} jobs found.`}
                </p>
                <button 
                  onClick={handlePostNewJob}
                  className="px-6 py-3 bg-[#6C5CE7] text-white rounded-xl hover:bg-[#5A4FCF] transition-colors font-medium"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            <span className="capitalize">{job.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.subject || 'General'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="capitalize">{job.jobType}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location?.city || 'Not specified'}</span>
                          </div>
                          {job.salaryRange?.min && job.salaryRange?.max && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{job.salaryRange.min} - ₹{job.salaryRange.max}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Posted: {new Date(job.postedAt).toLocaleDateString()}</span>
                          </div>
                          {job.applicationDeadline && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {job.classLevels && job.classLevels.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.classLevels.map((level, index) => (
                              <span key={index} className="px-2 py-1 bg-[#6C5CE7] bg-opacity-10 text-[#6C5CE7] text-xs rounded-full">
                                {level}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                      </div>

                      <div className="flex items-center space-x-4 ml-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">{job.applicants?.length || 0}</p>
                          <p className="text-xs text-gray-500">Applications</p>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === job.id ? null : job.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                          
                          {showDropdown === job.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                              <button
                                onClick={() => handleAction('view', job.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => handleAction('edit', job.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit Job</span>
                              </button>
                              <button
                                onClick={() => handleAction('applications', job.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Users className="w-4 h-4" />
                                <span>View Applications</span>
                              </button>
                              <hr className="my-2" />
                              <button
                                onClick={() => handleAction('delete', job.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Job</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleAction('applications', job.id)}
                          className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg hover:bg-[#5A4FCF] transition-colors text-sm font-medium"
                        >
                          View Applications ({job.applicants?.length || 0})
                        </button>
                        <button 
                          onClick={() => handleAction('edit', job.id)}
                          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Edit Job
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {job.status === 'open' && job.applicationDeadline && (
                          <span className="text-green-600 font-medium">
                            {Math.max(0, Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)))} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </SchoolLayout>
  );
};

export default JobPosts;