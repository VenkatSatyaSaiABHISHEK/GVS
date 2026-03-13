import React from "react";
import { User, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyTuitionRequests } from "@/services/tuitionServices";
import ParentLayout from "./ParentLayout";

const TuitionRequests = () => {
  const navigate = useNavigate();
  
  // Fetch tuition requests using React Query
  const { data: requestsResponse, isLoading, isError, error } = useQuery({
    queryKey: ["tuition-requests"],
    queryFn: getMyTuitionRequests
  });

  const requests = requestsResponse?.data || [];

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-yellow-100 text-yellow-600";
      case "Accepted": return "bg-green-100 text-green-600";
      case "Rejected": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Accepted": return <CheckCircle className="h-4 w-4" />;
      case "Rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (isError) {
    return (
      <ParentLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading requests</p>
            <p className="text-gray-600">{error?.message || "Please try again later"}</p>
          </div>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-2">
                Your Requests ({isLoading ? "..." : requests.length})
              </h2>
              <p className="text-[#6B7280]">Track your tuition requests and their status</p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#5B3DF5]" />
                <span className="ml-2 text-[#6B7280]">Loading requests...</span>
              </div>
            )}

            {/* Requests Table */}
            {!isLoading && requests.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Teacher</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Fee</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {request.teacherProfile ? (
                                <img 
                                  src={request.teacherProfile} 
                                  alt={request.teacher}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center mr-3">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                              )}
                              <span className="text-sm font-medium text-[#111827]">{request.teacher}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{request.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{request.fee}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                <span className="ml-1">{request.status}</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                            {formatDate(request.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              {request.status === "Pending" && (
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                  Cancel
                                </button>
                              )}
                              {request.status === "Accepted" && (
                                <button className="text-[#5B3DF5] hover:text-[#4B2BBF] text-sm">
                                  View Details
                                </button>
                              )}
                              <button className="text-[#6B7280] hover:text-[#111827] text-sm">
                                Message
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No Requests */}
            {!isLoading && requests.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">No Tuition Requests Yet</h3>
                <p className="text-[#6B7280] mb-6">You haven't sent any tuition requests. Start by finding teachers that match your needs.</p>
                <button 
                  className="px-6 py-3 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors"
                  onClick={() => navigate('/dashboard/parent/find-teachers')}
                >
                  Find Teachers
                </button>
              </div>
            )}
          </div>
    </ParentLayout>
  );
};

export default TuitionRequests;