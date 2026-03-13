import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherLayout from './TeacherDashboard/TeacherLayout';
import axiosInstance from '@/lib/axiosInstance';
import { getTeacherRequests, updateRequestStatus } from '@/services/tuitionServices';
import { toast } from 'sonner';
import {
  Users,
  Clock,
  Calendar,
  Briefcase,
  Video,
  MessageSquare,
  Eye,
  Check,
  X,
  MapPin,
  DollarSign,
  BookOpen,
  GraduationCap,
  Building2,
  TrendingUp,
} from 'lucide-react';

const TeacherMyClasses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingRequests: 0,
    upcomingClasses: 0,
    hiringOpportunities: 0,
  });
  const [bookedStudents, setBookedStudents] = useState([]);
  const [tuitionRequests, setTuitionRequests] = useState([]);
  const [hiringOpportunities, setHiringOpportunities] = useState([]);

  useEffect(() => {
    fetchClassesData();
  }, []);

  const fetchClassesData = async () => {
    try {
      setLoading(true);
      const [requestsRes, jobsRes] = await Promise.all([
        getTeacherRequests().catch(() => ({ requests: [] })),
        axiosInstance.get('/applications/teacher/recommended-jobs').catch(() => ({ data: { jobs: [] } })),
      ]);

      const requests = requestsRes?.requests || [];

      const pending = requests.filter((item) => item.status === 'requested');
      const accepted = requests.filter((item) => item.status === 'accepted');

      setBookedStudents(
        accepted.map((item) => ({
          id: item.id,
          studentName: item.parent?.fullName || 'Student',
          parentName: item.parent?.fullName || 'Parent',
          parentId: item.parent?.id,
          subject: item.subject || 'Subject',
          classType: item.mode || 'Hybrid',
          schedule: item.startDate ? new Date(item.startDate).toLocaleString() : 'To be scheduled',
          status: 'Upcoming',
        }))
      );

      setTuitionRequests(
        pending.map((item) => ({
          id: item.id,
          parentName: item.parent?.fullName || 'Parent',
          parentId: item.parent?.id,
          studentName: item.parent?.fullName || 'Student',
          subject: item.subject || 'Subject',
          classMode: item.mode || 'Hybrid',
          location: item.location || '-',
          budget: item.hourlyRate ? `₹${item.hourlyRate}/hr` : 'Negotiable',
        }))
      );

      setHiringOpportunities((jobsRes.data?.jobs || []).slice(0, 6).map((job) => ({
        id: job.id,
        collegeName: job.companyName || 'School',
        location: typeof job.location === 'string' ? job.location : (job.location?.city || 'N/A'),
        role: job.title || 'Teacher',
        department: job.subject || 'General',
        salary: job.salaryRange || 'Negotiable',
        experience: job.experience || 'N/A',
      })));

      setStats({
        totalStudents: accepted.length,
        pendingRequests: pending.length,
        upcomingClasses: accepted.length,
        hiringOpportunities: (jobsRes.data?.jobs || []).length,
      });
    } catch (error) {
      console.error('Error fetching classes data:', error);
      toast.error('Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await updateRequestStatus(requestId, 'accepted');
      toast.success('Request accepted successfully');
      await fetchClassesData();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return;
    }
    try {
      await updateRequestStatus(requestId, 'rejected');
      toast.success('Request rejected');
      await fetchClassesData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleMessageParent = (parentId) => {
    if (!parentId) return;
    navigate(`/dashboard/teacher/messages?userId=${parentId}`);
  };

  const handleStartClass = (classId) => {
    const cls = bookedStudents.find((item) => item.id === classId);
    if (!cls?.parentId) return;
    navigate(`/dashboard/teacher/messages?userId=${cls.parentId}`);
    toast.info('Opened parent chat to start class');
  };

  const handleViewDetails = (id, type) => {
    // TODO: Navigate to details page
    console.log('View details:', id, type);
  };

  const handleApplyJob = (jobId) => {
    navigate(`/dashboard/teacher/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B2EFF]"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="p-6 bg-[#F5F6FA] min-h-screen">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Classes</h1>
          <p className="text-gray-600">Manage your students, requests, and opportunities</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5B2EFF] to-[#7B61FF] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-500 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.totalStudents}</h3>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA500] to-[#FFB84D] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              {stats.pendingRequests > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                  New
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.pendingRequests}</h3>
            <p className="text-sm text-gray-500">Pending Requests</p>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#30C48D] to-[#4DD4A4] rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.upcomingClasses}</h3>
            <p className="text-sm text-gray-500">Upcoming Classes</p>
          </div>

          {/* Hiring Opportunities */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B9D] to-[#FF8FB5] rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.hiringOpportunities}</h3>
            <p className="text-sm text-gray-500">Hiring Opportunities</p>
          </div>
        </div>

        {/* Booked Students Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Booked Students</h2>
              <p className="text-sm text-gray-500 mt-1">Parents who booked your tuition classes</p>
            </div>
          </div>

          {bookedStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Student Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Parent Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Subject</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Class Type</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Schedule</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#5B2EFF] to-[#7B61FF] rounded-full flex items-center justify-center text-white font-bold">
                            {student.studentName.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{student.studentName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{student.parentName}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                          {student.subject}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          {student.classType === 'Online' ? (
                            <Video className="w-4 h-4 text-blue-500" />
                          ) : (
                            <MapPin className="w-4 h-4 text-green-500" />
                          )}
                          {student.classType}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{student.schedule}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            student.status === 'Upcoming'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartClass(student.id)}
                            className="p-2 bg-[#5B2EFF] text-white rounded-lg hover:bg-[#4A25CC] transition-all"
                            title="Start Class"
                          >
                            <Video className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMessageParent(student.parentId)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                            title="Message Parent"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewDetails(student.id, 'student')}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Booked Students</h3>
              <p className="text-sm text-gray-500">Students booked by parents will appear here</p>
            </div>
          )}
        </div>

        {/* Parent Tuition Requests Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">New Tuition Requests</h2>
              <p className="text-sm text-gray-500 mt-1">Parents requesting new classes</p>
            </div>
          </div>

          {tuitionRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tuitionRequests.map((request) => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {request.parentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{request.parentName}</h3>
                        <p className="text-sm text-gray-500">Parent</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Student:</span>
                      <span className="font-semibold text-gray-800">{request.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Subject:</span>
                      <span className="font-semibold text-purple-600">{request.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {request.classMode === 'Online' ? (
                        <Video className="w-4 h-4 text-gray-400" />
                      ) : (
                        <MapPin className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-semibold text-gray-800">{request.classMode}</span>
                    </div>
                    {request.classMode === 'Offline' && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold text-gray-800">{request.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-semibold text-green-600">{request.budget}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 bg-[#30C48D] text-white py-2 rounded-xl font-semibold hover:bg-[#28A876] transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleMessageParent(request.parentId)}
                      className="px-4 bg-blue-100 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-200 transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Requests</h3>
              <p className="text-sm text-gray-500">New tuition requests from parents will appear here</p>
            </div>
          )}
        </div>

        {/* College Hiring Opportunities Section */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">College Hiring Opportunities</h2>
              <p className="text-sm text-gray-500 mt-1">Colleges interested in hiring you</p>
            </div>
          </div>

          {hiringOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiringOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#5B2EFF] to-[#7B61FF] rounded-2xl flex items-center justify-center flex-shrink-0">
                      {opportunity.logo ? (
                        <img src={opportunity.logo} alt={opportunity.collegeName} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Building2 className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{opportunity.collegeName}</h3>
                      <p className="text-sm text-gray-500">{opportunity.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      <p className="font-semibold text-gray-800">{opportunity.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Department</p>
                      <p className="font-semibold text-purple-600">{opportunity.department}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Salary</p>
                        <p className="font-bold text-green-600">{opportunity.salary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Experience</p>
                        <p className="font-semibold text-gray-800">{opportunity.experience}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApplyJob(opportunity.id)}
                      className="flex-1 bg-[#5B2EFF] text-white py-2 rounded-xl font-semibold hover:bg-[#4A25CC] transition-all"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleViewDetails(opportunity.id, 'job')}
                      className="px-4 bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Hiring Opportunities</h3>
              <p className="text-sm text-gray-500">College hiring opportunities will appear here</p>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherMyClasses;
