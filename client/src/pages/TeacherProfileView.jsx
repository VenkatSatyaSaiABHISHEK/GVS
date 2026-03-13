import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SchoolLayout from '@/components/Dashboard/SchoolDashboard/SchoolLayout';
import {
  User,
  MapPin,
  Star,
  Award,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  GraduationCap,
  BookOpen,
  Clock,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { getSchoolPipeline, scheduleInterview } from '@/services/applicationServices';

const TeacherProfileView = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('Hi, I would like to discuss an opportunity with you.');
  const [sendingContact, setSendingContact] = useState(false);
  const [schedulingInterview, setSchedulingInterview] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewType: 'online',
    meetingLink: '',
    interviewLocation: '',
    interviewInstructions: '',
  });

  // Fetch teacher data from API
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/${teacherId}`);
        
        if (response.data.success) {
          const userData = response.data.user;
          
          // Transform API data to match component structure
          const transformedTeacher = {
            id: userData.id,
            name: userData.fullName || 'Teacher',
            subject: userData.primarySubject || 'Subject',
            yearsOfExperience: userData.yoe || '0 years',
            qualification: userData.qualification || 'Not specified',
            rating: userData.rating || 4.5,
            totalReviews: userData.totalReviews || 0,
            location: userData.city || userData.address || 'Location',
            city: userData.city || '',
            state: userData.state || '',
            hourlyRate: userData.hourlyRate || '₹500/hour',
            availability: userData.availableForHire ? 'Available' : 'Busy',
            verified: userData.isVerified || false,
            email: userData.email || '',
            phone: userData.contact || '',
            whatsapp: userData.contact || '',
            profileImage: userData.profilePic || null,
            bio: userData.bio || 'No bio available',
            specializations: userData.specializations || [],
            languages: userData.languages || ['English'],
            teachingMode: userData.teachingMode || 'Hybrid',
            skills: userData.skills || [],
            education: userData.education || [],
            workExperience: userData.experience || [],
            achievements: userData.achievements || [],
            stats: {
              studentsTaught: userData.studentsTaught || 0,
              successRate: userData.successRate || 0,
              classesCompleted: userData.classesCompleted || 0,
              yearsExperience: parseInt(userData.yoe) || 0
            }
          };
          
          setTeacher(transformedTeacher);
        }
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
        setError(err.response?.data?.message || 'Failed to load teacher profile');
        toast.error('Failed to load teacher profile');
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherProfile();
    }
  }, [teacherId]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved teachers' : 'Added to saved teachers');
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleSendContact = async () => {
    if (!teacher?.id) return;
    if (!contactMessage.trim()) {
      toast.error('Message is required');
      return;
    }
    try {
      setSendingContact(true);
      await axiosInstance.post('/messages/send', {
        receiverId: teacher.id,
        message: contactMessage,
        relatedTo: 'general',
      });
      toast.success('Message sent to teacher');
      setShowContactModal(false);
      navigate('/dashboard/school/messages');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingContact(false);
    }
  };

  const handleOpenScheduleModal = () => {
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = async () => {
    if (!teacher?.id) return;
    if (!interviewForm.interviewDate || !interviewForm.interviewTime) {
      toast.error('Interview date and time are required');
      return;
    }

    try {
      setSchedulingInterview(true);
      const pipeline = await getSchoolPipeline();
      const allApplications = Object.values(pipeline?.pipeline || {}).flat();
      const teacherApplication = allApplications.find((application) => application?.applicant?.id === teacher.id);

      if (!teacherApplication?.id) {
        toast.error('No application found for this teacher. Move candidate via Applications first.');
        return;
      }

      await scheduleInterview(teacherApplication.id, interviewForm);
      toast.success('Interview scheduled successfully');
      setShowInterviewModal(false);
      navigate('/dashboard/school/interviews');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSchedulingInterview(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link copied to clipboard!');
  };

  // Loading state
  if (loading) {
    return (
      <SchoolLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#6C5CE7] mx-auto mb-4" />
            <p className="text-gray-600">Loading teacher profile...</p>
          </div>
        </div>
      </SchoolLayout>
    );
  }

  // Error state
  if (error || !teacher) {
    return (
      <SchoolLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Teacher Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'Unable to load teacher profile'}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-2xl flex items-center justify-center flex-shrink-0">
                    {teacher.profileImage ? (
                      <img src={teacher.profileImage} alt={teacher.name} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
                      {teacher.verified && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          <Award className="w-4 h-4" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xl text-gray-600 mb-3">{teacher.subject} Teacher</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{teacher.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{teacher.yearsOfExperience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{teacher.rating}</span>
                        <span>({teacher.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className={`p-3 rounded-xl transition-colors ${
                      isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-[#6C5CE7] bg-opacity-5 rounded-xl">
                  <p className="text-2xl font-bold text-[#6C5CE7]">{teacher.stats.studentsTaught}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{teacher.stats.successRate}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{teacher.stats.classesCompleted}</p>
                  <p className="text-sm text-gray-600">Classes</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-2xl font-bold text-orange-600">{teacher.stats.yearsExperience}</p>
                  <p className="text-sm text-gray-600">Years Exp</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleContact}
                  className="flex-1 bg-[#6C5CE7] hover:bg-[#5A4FCF] text-white py-6 text-lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Teacher
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenScheduleModal}
                  className="px-6 py-6 border-2 border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white"
                >
                  Schedule Interview
                </Button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Specializations</h2>
              {teacher.specializations && teacher.specializations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#6C5CE7] bg-opacity-10 text-[#6C5CE7] rounded-full font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specializations listed</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
              {teacher.skills && teacher.skills.length > 0 ? (
                <div className="space-y-4">
                  {teacher.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">
                          {typeof skill === 'string' ? skill : skill.name}
                        </span>
                        <span className="text-gray-600">
                          {typeof skill === 'object' && skill.level ? `${skill.level}%` : ''}
                        </span>
                      </div>
                      {typeof skill === 'object' && skill.level && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#6C5CE7] h-2 rounded-full transition-all"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2 text-[#6C5CE7]" />
                Education
              </h2>
              {teacher.education && teacher.education.length > 0 ? (
                <div className="space-y-4">
                  {teacher.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#6C5CE7] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#6C5CE7]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.yearOfGraduation || edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No education history listed</p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-[#6C5CE7]" />
                Experience
              </h2>
              {teacher.workExperience && teacher.workExperience.length > 0 ? (
                <div className="space-y-4">
                  {teacher.workExperience.map((exp, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-[#6C5CE7] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-[#6C5CE7]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{exp.jobTitle || exp.role}</h3>
                        <p className="text-gray-600">{exp.employer || exp.institution}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {exp.duration || `${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}`}
                        </p>
                        <p className="text-sm text-gray-600">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No work experience listed</p>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-[#6C5CE7]" />
                Achievements
              </h2>
              {teacher.achievements && teacher.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teacher.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No achievements listed</p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#6C5CE7] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#6C5CE7] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{teacher.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#6C5CE7] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-sm font-medium text-gray-800">{teacher.whatsapp}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="text-2xl font-bold text-[#6C5CE7]">{teacher.hourlyRate}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Availability</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${teacher.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">{teacher.availability}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teaching Mode</span>
                  <span className="text-sm font-medium">{teacher.teachingMode}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Languages</h3>
              {teacher.languages && teacher.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No languages listed</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Teacher</h3>
            <textarea
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
              rows={5}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Type your message..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowContactModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleSendContact} disabled={sendingContact} className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg disabled:opacity-50">
                {sendingContact ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Interview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="date" value={interviewForm.interviewDate} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewDate: event.target.value }))} className="px-4 py-2 border rounded-lg" />
              <input type="text" value={interviewForm.interviewTime} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewTime: event.target.value }))} placeholder="e.g. 2:00 PM" className="px-4 py-2 border rounded-lg" />
              <select value={interviewForm.interviewType} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewType: event.target.value }))} className="px-4 py-2 border rounded-lg">
                <option value="online">Online</option>
                <option value="offline">In-person</option>
              </select>
              <input type="text" value={interviewForm.meetingLink} onChange={(event) => setInterviewForm((prev) => ({ ...prev, meetingLink: event.target.value }))} placeholder="Meeting link" className="px-4 py-2 border rounded-lg" />
              <input type="text" value={interviewForm.interviewLocation} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewLocation: event.target.value }))} placeholder="Interview location" className="px-4 py-2 border rounded-lg md:col-span-2" />
              <textarea value={interviewForm.interviewInstructions} onChange={(event) => setInterviewForm((prev) => ({ ...prev, interviewInstructions: event.target.value }))} rows={3} placeholder="Instructions for candidate" className="px-4 py-2 border rounded-lg md:col-span-2" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowInterviewModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleScheduleInterview} disabled={schedulingInterview} className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg disabled:opacity-50">
                {schedulingInterview ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SchoolLayout>
  );
};

export default TeacherProfileView;
