const STATUS_STEPS = [
  'applied',
  'application_viewed',
  'shortlisted',
  'interview_scheduled',
  'interview_completed',
  'selected',
  'offer_sent',
  'hired',
];

const STATUS_LABEL = {
  applied: 'Applied',
  application_viewed: 'Application Viewed',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  interview_completed: 'Interview Completed',
  selected: 'Selected',
  offer_sent: 'Offer Sent',
  hired: 'Hired',
  rejected: 'Rejected',
};

const ApplicationTracker = ({ applications = [] }) => {
  const latest = applications.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Status Tracker</h3>

      {latest.length === 0 ? (
        <p className="text-sm text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-5">
          {latest.map((application) => {
            const currentIndex = STATUS_STEPS.indexOf(application.status);
            return (
              <div key={application.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-800">{application.job?.title || 'Job'}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${application.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>
                    {STATUS_LABEL[application.status] || application.status}
                  </span>
                </div>

                <div className="flex gap-1 flex-wrap">
                  {STATUS_STEPS.map((step, index) => {
                    const active = currentIndex >= index;
                    return (
                      <div key={step} className={`h-2 rounded-full flex-1 min-w-6 ${active ? 'bg-purple-500' : 'bg-gray-200'}`} title={STATUS_LABEL[step]} />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
