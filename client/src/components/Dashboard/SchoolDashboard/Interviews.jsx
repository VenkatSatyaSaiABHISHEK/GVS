import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Plus,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import SchoolLayout from './SchoolLayout';
import { getSchoolPipeline, scheduleInterview, submitInterviewFeedback } from '@/services/applicationServices';

const Interviews = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewType: 'online',
    meetingLink: '',
    interviewLocation: '',
    interviewInstructions: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({
    feedback: '',
    demoEvaluation: '',
  });

  const { data: pipelineData, isLoading } = useQuery({
    queryKey: ['school-pipeline-interviews'],
    queryFn: getSchoolPipeline,
    refetchInterval: 20000,
  });

  const scheduled = useMemo(() => pipelineData?.pipeline?.interview_scheduled || [], [pipelineData]);
  const completed = useMemo(() => pipelineData?.pipeline?.interview_completed || [], [pipelineData]);

  const interviews = useMemo(() => {
    return [...scheduled, ...completed]
      .map((application) => ({
        id: application.id,
        candidateName: application.applicant?.fullName || 'Candidate',
        candidateEmail: application.applicant?.email || '-',
        candidatePhone: application.applicant?.contact || '-',
        jobTitle: application.job?.title || 'Job',
        interviewDate: application.interviewDate,
        interviewTime: application.interviewTime,
        interviewType: application.interviewType || 'video',
        meetingLink: application.meetingLink,
        interviewLocation: application.interviewLocation,
        interviewInstructions: application.interviewInstructions,
        status: application.status,
        interviewFeedback: application.interviewFeedback,
        demoEvaluation: application.demoEvaluation,
      }))
      .sort((a, b) => new Date(b.interviewDate || 0).getTime() - new Date(a.interviewDate || 0).getTime());
  }, [scheduled, completed]);

  const filteredInterviews = useMemo(() => {
    if (activeTab === 'all') return interviews;
    if (activeTab === 'completed') return interviews.filter((item) => item.status === 'interview_completed');
    return interviews.filter((item) => item.status === 'interview_scheduled');
  }, [activeTab, interviews]);

  const scheduleMutation = useMutation({
    mutationFn: ({ applicationId, payload }) => scheduleInterview(applicationId, payload),
    onSuccess: () => {
      toast.success('Interview scheduled successfully');
      setShowScheduleModal(false);
      setSelectedApplication(null);
      setScheduleForm({
        interviewDate: '',
        interviewTime: '',
        interviewType: 'online',
        meetingLink: '',
        interviewLocation: '',
        interviewInstructions: '',
      });
      queryClient.invalidateQueries({ queryKey: ['school-pipeline-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['school-applications'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to schedule interview');
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ applicationId, payload }) => submitInterviewFeedback(applicationId, payload),
    onSuccess: () => {
      toast.success('Interview feedback submitted');
      setShowFeedbackModal(false);
      setSelectedApplication(null);
      setFeedbackForm({ feedback: '', demoEvaluation: '' });
      queryClient.invalidateQueries({ queryKey: ['school-pipeline-interviews'] });
      queryClient.invalidateQueries({ queryKey: ['school-applications'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to submit feedback');
    },
  });

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: interviews.filter((item) => item.status === 'interview_scheduled').length },
    { id: 'completed', label: 'Completed', count: interviews.filter((item) => item.status === 'interview_completed').length },
    { id: 'all', label: 'All', count: interviews.length },
  ];

  const openScheduleFor = (application) => {
    setSelectedApplication(application);
    setScheduleForm({
      interviewDate: application.interviewDate ? format(new Date(application.interviewDate), 'yyyy-MM-dd') : '',
      interviewTime: application.interviewTime || '',
      interviewType: application.interviewType || 'online',
      meetingLink: application.meetingLink || '',
      interviewLocation: application.interviewLocation || '',
      interviewInstructions: application.interviewInstructions || '',
    });
    setShowScheduleModal(true);
  };

  const openFeedbackFor = (application) => {
    setSelectedApplication(application);
    setFeedbackForm({
      feedback: application.interviewFeedback || '',
      demoEvaluation: application.demoEvaluation || '',
    });
    setShowFeedbackModal(true);
  };

  const onSubmitSchedule = () => {
    if (!selectedApplication) return;
    if (!scheduleForm.interviewDate || !scheduleForm.interviewTime) {
      toast.error('Date and time are required');
      return;
    }

    scheduleMutation.mutate({
      applicationId: selectedApplication.id,
      payload: scheduleForm,
    });
  };

  const onSubmitFeedback = () => {
    if (!selectedApplication) return;
    if (!feedbackForm.feedback.trim()) {
      toast.error('Feedback is required');
      return;
    }

    feedbackMutation.mutate({
      applicationId: selectedApplication.id,
      payload: feedbackForm,
    });
  };

  const formatInterviewDate = (date) => {
    if (!date) return 'TBD';
    try {
      return format(new Date(date), 'EEE, MMM d, yyyy');
    } catch {
      return 'TBD';
    }
  };

  return (
    <>
      <SchoolLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Interviews</h1>
            <p className="text-gray-600">Schedule and manage candidate interviews</p>
          </div>
          <button
            onClick={() => {
              const target = scheduled[0];
              if (!target) {
                toast.error('No shortlisted interview candidates found yet');
                return;
              }
              openScheduleFor(target);
            }}
            className="bg-[#6C5CE7] text-white px-6 py-3 rounded-xl hover:bg-[#5A4FCF] transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Interview</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-800">{interviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#6C5CE7] bg-opacity-10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#6C5CE7]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{tabs[0].count}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{tabs[1].count}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pipeline Applicants</p>
                <p className="text-2xl font-bold text-orange-600">{pipelineData?.analytics?.totalApplicants || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
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
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-[#6C5CE7]" />
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No interviews found for this tab.</div>
            ) : (
              filteredInterviews.map((interview) => (
                <div key={interview.id} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{interview.candidateName}</h3>
                      <p className="text-[#6C5CE7] font-medium">{interview.jobTitle}</p>
                      <p className="text-sm text-gray-500 mt-1">{interview.candidateEmail} • {interview.candidatePhone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      interview.status === 'interview_completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {interview.status === 'interview_completed' ? 'Completed' : 'Scheduled'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-600">
                    <div className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatInterviewDate(interview.interviewDate)}</div>
                    <div className="inline-flex items-center gap-2"><Clock className="w-4 h-4" /> {interview.interviewTime || 'TBD'}</div>
                    <div className="inline-flex items-center gap-2">
                      {interview.interviewType === 'offline' ? <MapPin className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      {interview.interviewType === 'offline' ? 'In-person' : 'Online'}
                    </div>
                  </div>

                  {interview.interviewInstructions && (
                    <p className="text-sm text-gray-600 mt-3">{interview.interviewInstructions}</p>
                  )}

                  {interview.interviewFeedback && (
                    <div className="mt-3 p-3 bg-green-50 rounded-xl text-sm text-green-700">
                      <div className="font-medium mb-1">Feedback</div>
                      <div>{interview.interviewFeedback}</div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => openScheduleFor(interview)}
                      className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg text-sm hover:bg-[#5A4FCF]"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => openFeedbackFor(interview)}
                      className="px-4 py-2 border border-[#6C5CE7] text-[#6C5CE7] rounded-lg text-sm hover:bg-[#F4F2FF]"
                    >
                      Add Feedback
                    </button>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Join Link
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Interview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="date" value={scheduleForm.interviewDate} onChange={(event) => setScheduleForm((prev) => ({ ...prev, interviewDate: event.target.value }))} className="px-4 py-2 border rounded-lg" />
              <input type="text" value={scheduleForm.interviewTime} onChange={(event) => setScheduleForm((prev) => ({ ...prev, interviewTime: event.target.value }))} placeholder="e.g. 2:00 PM" className="px-4 py-2 border rounded-lg" />
              <select value={scheduleForm.interviewType} onChange={(event) => setScheduleForm((prev) => ({ ...prev, interviewType: event.target.value }))} className="px-4 py-2 border rounded-lg">
                <option value="online">Online</option>
                <option value="offline">In-person</option>
              </select>
              <input type="text" value={scheduleForm.meetingLink} onChange={(event) => setScheduleForm((prev) => ({ ...prev, meetingLink: event.target.value }))} placeholder="Meeting link (optional)" className="px-4 py-2 border rounded-lg" />
              <input type="text" value={scheduleForm.interviewLocation} onChange={(event) => setScheduleForm((prev) => ({ ...prev, interviewLocation: event.target.value }))} placeholder="Location (optional)" className="px-4 py-2 border rounded-lg md:col-span-2" />
              <textarea value={scheduleForm.interviewInstructions} onChange={(event) => setScheduleForm((prev) => ({ ...prev, interviewInstructions: event.target.value }))} placeholder="Instructions (optional)" rows={3} className="px-4 py-2 border rounded-lg md:col-span-2" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={onSubmitSchedule} className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg" disabled={scheduleMutation.isPending}>
                {scheduleMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Feedback</h3>
            <div className="space-y-3">
              <textarea value={feedbackForm.feedback} onChange={(event) => setFeedbackForm((prev) => ({ ...prev, feedback: event.target.value }))} placeholder="Feedback" rows={4} className="w-full px-4 py-2 border rounded-lg" />
              <textarea value={feedbackForm.demoEvaluation} onChange={(event) => setFeedbackForm((prev) => ({ ...prev, demoEvaluation: event.target.value }))} placeholder="Demo evaluation (optional)" rows={3} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowFeedbackModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={onSubmitFeedback} className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg" disabled={feedbackMutation.isPending}>
                {feedbackMutation.isPending ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      </SchoolLayout>
    </>
  );
};

export default Interviews;
