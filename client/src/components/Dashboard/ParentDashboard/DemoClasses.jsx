import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Video, Clock, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ParentLayout from './ParentLayout';
import { getParentRequests } from '@/services/tuitionServices';

const DemoClasses = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['parent-demo-classes'],
    queryFn: getParentRequests,
    refetchInterval: 20000,
  });

  const demoClasses = useMemo(() => {
    const requests = data?.requests || [];
    return requests
      .filter((item) => ['accepted', 'completed', 'requested'].includes(item.status))
      .map((item) => ({
        id: item.id,
        teacherId: item.teacher?.id,
        teacher: item.teacher?.fullName || 'Teacher',
        subject: item.subject || item.teacher?.primarySubject || 'Subject',
        date: item.startDate ? new Date(item.startDate).toLocaleDateString() : 'TBD',
        time: item.startDate ? new Date(item.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
        duration: '45 min',
        status: item.status === 'accepted' ? 'Confirmed' : item.status === 'completed' ? 'Completed' : 'Scheduled',
        meetingLink: item.mode?.toLowerCase().includes('online') ? (item.meetingLink || null) : null,
      }));
  }, [data]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-600';
      case 'Confirmed': return 'bg-green-100 text-green-600';
      case 'Completed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleJoin = (demo) => {
    if (demo.meetingLink) {
      window.open(demo.meetingLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (demo.teacherId) {
      navigate(`/dashboard/parent/messages?userId=${demo.teacherId}`);
      toast.info('No meeting link yet. Opened chat with teacher.');
      return;
    }
    toast.info('Meeting link not available yet');
  };

  return (
    <ParentLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-2">Your Demo Classes ({demoClasses.length})</h2>
          <p className="text-[#6B7280]">Manage your scheduled and completed demo classes</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[#6B7280]">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading demo classes...
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl p-6 text-red-600">Failed to load demo classes</div>
        ) : demoClasses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-[0px_8px_24px_rgba(0,0,0,0.06)] text-[#6B7280]">
            No demo classes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoClasses.map((demo) => (
              <div key={demo.id} className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111827]">{demo.teacher}</h3>
                      <p className="text-sm text-[#6B7280]">{demo.subject}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(demo.status)}`}>
                    {demo.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[#6B7280]" />
                    <span className="text-sm text-[#111827]">{demo.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-[#6B7280]" />
                    <span className="text-sm text-[#111827]">{demo.time} ({demo.duration})</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {(demo.status === 'Scheduled' || demo.status === 'Confirmed') ? (
                    <button onClick={() => handleJoin(demo)} className="flex-1 bg-[#5B3DF5] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#4B2BBF] transition-colors flex items-center justify-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>Join Class</span>
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/dashboard/parent/messages?userId=${demo.teacherId}`)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  )}
                  <button onClick={() => navigate(`/dashboard/parent/messages?userId=${demo.teacherId}`)} className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
};

export default DemoClasses;
