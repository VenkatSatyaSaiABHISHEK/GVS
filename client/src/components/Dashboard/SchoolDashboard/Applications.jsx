import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { formatLocation } from '@/utils/formatLocation';
import SchoolLayout from './SchoolLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Download,
  MessageSquare,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const Applications = () => {
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(jobIdFromUrl || '');

  // Update selectedJob when URL changes
  useEffect(() => {
    if (jobIdFromUrl) {
      setSelectedJob(jobIdFromUrl);
    }
  }, [jobIdFromUrl]);

  // Fetch applications from database
  const { data: applicationsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['school-applications'],
    queryFn: async () => {
      const response = await axiosInstance.get('/applications/school');
      return response.data;
    },
    retry: false
  });

  const applications = applicationsData?.applications || [];

  // Get unique jobs from applications
  const uniqueJobs = [...new Map(applications.map(app => [app.job?.id, app.job])).values()].filter(Boolean);

  const tabs = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'applied', label: 'New', count: applications.filter(app => app.status === 'applied').length },
    { id: 'application_viewed', label: 'Viewed', count: applications.filter(app => app.status === 'application_viewed').length },
    { id: 'shortlisted', label: 'Shortlisted', count: applications.filter(app => app.status === 'shortlisted').length },
    { id: 'interview_scheduled', label: 'Interview Scheduled', count: applications.filter(app => app.status === 'interview_scheduled').length },
    { id: 'interview_completed', label: 'Interview Completed', count: applications.filter(app => app.status === 'interview_completed').length },
    { id: 'offer_sent', label: 'Offer Sent', count: applications.filter(app => app.status === 'offer_sent').length },
    { id: 'hired', label: 'Hired', count: applications.filter(app => app.status === 'hired').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = app.applicant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJob = !selectedJob || app.job?.id === selectedJob;
    
    return matchesTab && matchesSearch && matchesJob;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-yellow-100 text-yellow-800';
      case 'application_viewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-indigo-100 text-indigo-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'interview_completed': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'offer_sent': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'application_viewed': return <Eye className="w-4 h-4" />;
      case 'shortlisted': return <Users className="w-4 h-4" />;
      case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
      case 'interview_completed': return <CheckCircle className="w-4 h-4" />;
      case 'offer_sent': return <FileText className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getNextStage = (status) => {
    const stages = [
      'applied',
      'application_viewed',
      'shortlisted',
      'interview_scheduled',
      'interview_completed',
      'selected',
      'offer_sent',
      'hired',
    ];
    const index = stages.indexOf(status);
    return index >= 0 && index < stages.length - 1 ? stages[index + 1] : null;
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axiosInstance.patch(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  return (
    <SchoolLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Applications</h1>
          <p className="text-gray-600">Review and manage teacher applications</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center space-x-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Applications</h3>
              <p className="text-red-600">Failed to load applications. Please try again later.</p>
            </div>
          </div>
        )}

        {/* Content - Only show when not loading and no error */}
        {!isLoading && !isError && (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-800">{applications.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#6C5CE7] bg-opacity-10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#6C5CE7]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Applications</p>
                <p className="text-2xl font-bold text-yellow-600">{applications.filter(app => app.status === 'applied').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Review</p>
                <p className="text-2xl font-bold text-blue-600">{applications.filter(app => app.status === 'application_viewed' || app.status === 'shortlisted').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hired</p>
                <p className="text-2xl font-bold text-green-600">{applications.filter(app => app.status === 'hired').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent"
              />
            </div>

            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent"
            >
              <option value="">All Job Positions</option>
              {uniqueJobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent">
                <option>Sort by Date</option>
                <option>Sort by Rating</option>
                <option>Sort by Experience</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm transition-colors relative whitespace-nowrap ${
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

          {/* Applications List */}
          <div className="p-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No applications found</h3>
                <p className="text-gray-500">No applications match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map(application => (
                  <div key={application.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{application.applicant?.fullName || 'Unknown'}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span className="capitalize">{application.status}</span>
                            </span>
                          </div>
                          
                          <p className="text-[#6C5CE7] font-medium mb-2">{application.job?.title || 'Job Title'}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{formatLocation({ city: application.applicant?.city, state: application.applicant?.state })}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-500">Experience:</span>
                              <p className="font-medium">{application.applicant?.yoe || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Qualification:</span>
                              <p className="font-medium">{application.applicant?.qualification || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Salary Range:</span>
                              <p className="font-medium">₹{application.job?.salaryRange?.min || '0'} - ₹{application.job?.salaryRange?.max || '0'}</p>
                            </div>
                          </div>

                          {application.applicant?.skills && application.applicant.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {application.applicant.skills.slice(0, 5).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-[#6C5CE7] bg-opacity-10 text-[#6C5CE7] text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send Message">
                          <MessageSquare className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Call">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Email">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{application.applicant?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{application.applicant?.contact || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => window.location.href = `/dashboard/school/teacher/${application.applicant?.id}`}
                          className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg hover:bg-[#5A4FCF] transition-colors text-sm font-medium"
                        >
                          View Full Profile
                        </button>
                        {application.status === 'applied' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(application.id, 'application_viewed')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Mark Viewed
                            </button>
                            <button 
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {application.status !== 'hired' && application.status !== 'rejected' && getNextStage(application.status) && (
                          <button
                            onClick={() => handleStatusChange(application.id, getNextStage(application.status))}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            Move to Next Stage
                          </button>
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

export default Applications;