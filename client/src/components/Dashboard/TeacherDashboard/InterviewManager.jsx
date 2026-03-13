const buildCalendarUrl = (application) => {
  if (!application.interviewDate) return '#';
  const start = new Date(application.interviewDate);
  if (application.interviewTime) {
    const [h, m] = application.interviewTime.split(':').map(Number);
    if (!Number.isNaN(h)) start.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const text = encodeURIComponent(`Interview - ${application.job?.title || 'Job'}`);
  const details = encodeURIComponent(application.interviewInstructions || 'Interview discussion');
  const location = encodeURIComponent(application.meetingLink || application.interviewLocation || 'Online');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`;
};

const InterviewManager = ({ applications = [] }) => {
  const interviews = applications.filter((application) => application.status === 'interview_scheduled').slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Management</h3>

      {interviews.length === 0 ? (
        <p className="text-sm text-gray-500">No interviews scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {interviews.map((application) => (
            <div key={application.id} className="border border-gray-100 rounded-xl p-4">
              <p className="font-medium text-gray-800">{application.job?.title || 'Interview'}</p>
              <p className="text-sm text-gray-600 mt-1">
                {application.interviewDate ? new Date(application.interviewDate).toLocaleDateString() : 'Date TBD'}
                {application.interviewTime ? ` • ${application.interviewTime}` : ''}
                {application.interviewType ? ` • ${application.interviewType}` : ''}
              </p>
              {application.meetingLink && (
                <a href={application.meetingLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline block mt-2">
                  Open meeting link
                </a>
              )}
              {application.interviewLocation && <p className="text-sm text-gray-500 mt-1">Location: {application.interviewLocation}</p>}
              {application.interviewInstructions && <p className="text-sm text-gray-500 mt-1">{application.interviewInstructions}</p>}

              <a
                href={buildCalendarUrl(application)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-3 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
              >
                Add to Calendar
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewManager;
