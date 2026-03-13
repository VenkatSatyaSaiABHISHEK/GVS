import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherLayout from './TeacherDashboard/TeacherLayout';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Clock,
  Users,
  DollarSign,
  Upload,
  X,
  FileText,
  Mail,
} from 'lucide-react';

const TeacherJobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    aboutYou: '',
    expectedSalary: '',
    availableFrom: '',
  });
  
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    prefillUserData();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/jobs/${jobId}/job-data`);
      
      // getJobById returns job data at top level (not wrapped in .job)
      const jobData = response.data.job || response.data;
      if (jobData && jobData.id) {
        setJob(jobData);
      }

      // Check if already applied
      try {
        const checkRes = await axiosInstance.get(`/applications/jobs/${jobId}/check`);
        if (checkRes.data.hasApplied) {
          toast.error('You have already applied for this job');
          navigate(`/dashboard/teacher/jobs/${jobId}`);
        }
      } catch (e) {
        // ignore check error
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
      navigate('/dashboard/teacher/jobs');
    } finally {
      setLoading(false);
    }
  };

  const prefillUserData = () => {
    if (user) {
      const nameParts = user.fullName?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '',
        lastName: nameParts[nameParts.length - 1] || '',
        email: user.email || '',
        phoneNumber: user.contact || '',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or DOC file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setResume(file);
      setResumePreview({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
      });
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    setResumePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Submit application with form data
      const response = await axiosInstance.post(`/applications/jobs/${jobId}/apply`, {
        coverLetter: formData.aboutYou,
        aboutYou: formData.aboutYou,
        expectedSalary: formData.expectedSalary,
        availableFrom: formData.availableFrom,
      });

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        navigate(`/dashboard/teacher/jobs/${jobId}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      navigate(`/dashboard/teacher/jobs/${jobId}`);
    }
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

  if (!job) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Job not found</p>
            <button
              onClick={() => navigate('/dashboard/teacher/jobs')}
              className="text-[#5B2EFF] hover:underline"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="p-6 bg-[#F5F6FA] min-h-screen overflow-y-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/dashboard/teacher/jobs/${jobId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#5B2EFF] transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Job Details</span>
          </button>
          <p className="text-sm text-gray-500">
            Search Job / {job.title} / Apply Job
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Company & Job Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  {job.company?.logo ? (
                    <img
                      src={job.company.logo}
                      alt={job.company.displayName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-[#5B2EFF]" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {job.company?.displayName || 'Company'}
                  </h3>
                  <p className="text-sm text-gray-500">{job.company?.subtitle || 'Company'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#5B2EFF] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#4A25CC] transition-all">
                  Following
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>

            {/* Job Summary Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{job.title}</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#5B2EFF]" />
                  <div>
                    <p className="text-xs text-gray-500">Work Level</p>
                    <p className="text-sm font-semibold text-gray-800">{job.workLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#5B2EFF]" />
                  <div>
                    <p className="text-xs text-gray-500">Min Experience</p>
                    <p className="text-sm font-semibold text-gray-800">{job.minExperience}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#5B2EFF]" />
                  <div>
                    <p className="text-xs text-gray-500">Employee Type</p>
                    <p className="text-sm font-semibold text-gray-800">{job.employeeType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#5B2EFF]" />
                  <div>
                    <p className="text-xs text-gray-500">Salary</p>
                    <p className="text-sm font-semibold text-gray-800">{job.salary}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Job Overview</h4>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                  {job.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Fill the job applications</h2>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Oda"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dink"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+12 3456 789"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="odadinkrenz@mail.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary (Optional)
                  </label>
                  <input
                    type="number"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From (Optional)
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* About You */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You / Cover Letter
                </label>
                <textarea
                  name="aboutYou"
                  value={formData.aboutYou}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell us about yourself and why you're interested in this position..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#5B2EFF] focus:border-transparent"
                />
              </div>

              {/* Resume Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach your resume <span className="text-red-500">*</span>
                </label>
                
                {!resumePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#5B2EFF] transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your resume here or
                    </p>
                    <label className="inline-block bg-[#5B2EFF] text-white px-6 py-2 rounded-xl font-semibold cursor-pointer hover:bg-[#4A25CC] transition-all">
                      Upload Files
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-3">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#5B2EFF] bg-opacity-10 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#5B2EFF]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{resumePreview.name}</p>
                        <p className="text-sm text-gray-500">{resumePreview.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons - Fixed at bottom with clear visibility */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    submitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#5B2EFF] text-white hover:bg-[#4A25CC] hover:shadow-xl'
                  }`}
                >
                  {submitting ? 'Submitting...' : '✓ Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-lg disabled:opacity-50"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherJobApplication;
