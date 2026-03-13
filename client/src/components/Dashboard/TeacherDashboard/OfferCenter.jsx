import { respondToOffer } from '@/services/applicationServices';
import { toast } from 'sonner';

const OfferCenter = ({ applications = [], onUpdated }) => {
  const offers = applications.filter((application) => application.status === 'offer_sent').slice(0, 4);

  const handleAction = async (applicationId, action) => {
    try {
      await respondToOffer(applicationId, action);
      toast.success(`Offer ${action}ed successfully`);
      onUpdated?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to respond to offer');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Offer Letters</h3>

      {offers.length === 0 ? (
        <p className="text-sm text-gray-500">No offers yet.</p>
      ) : (
        <div className="space-y-4">
          {offers.map((application) => (
            <div key={application.id} className="border border-gray-100 rounded-xl p-4">
              <p className="font-medium text-gray-800">{application.job?.title || 'Offer'}</p>
              <p className="text-sm text-gray-600 mt-1">Salary: {application.offerSalary ? `₹${application.offerSalary}` : 'Not specified'}</p>
              <p className="text-sm text-gray-600">Subject: {application.offerSubject || application.job?.subject || 'N/A'}</p>
              <p className="text-sm text-gray-600">Joining: {application.joiningDate ? new Date(application.joiningDate).toLocaleDateString() : 'TBD'}</p>
              {application.offerTerms && <p className="text-sm text-gray-500 mt-2">{application.offerTerms}</p>}

              <div className="flex gap-2 mt-3">
                <button onClick={() => handleAction(application.id, 'accept')} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  Accept Offer
                </button>
                <button onClick={() => handleAction(application.id, 'reject')} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  Reject Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferCenter;
