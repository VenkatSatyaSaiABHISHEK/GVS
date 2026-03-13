import React from "react";
import { User, Users, Star, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyTuitionRequests } from "@/services/tuitionServices";
import ParentLayout from "./ParentLayout";

const MyTutors = () => {
  // Fetch accepted tuition requests (these are our active tutors)
  const { data: requestsResponse, isLoading, isError } = useQuery({
    queryKey: ["my-tutors"],
    queryFn: getMyTuitionRequests
  });

  const myTutors = requestsResponse?.data?.filter(request => request.status === "Accepted") || [];

  return (
    <ParentLayout>
      <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-2">
                Active Tutors ({isLoading ? "..." : myTutors.length})
              </h2>
              <p className="text-[#6B7280]">Manage your current tutoring relationships</p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B3DF5]"></div>
                <span className="ml-2 text-[#6B7280]">Loading tutors...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-2">Error loading tutors</p>
                <p className="text-gray-600">Please try again later</p>
              </div>
            )}

            {/* Tutors Grid */}
            {!isLoading && !isError && myTutors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTutors.map((tutor) => (
                  <div key={tutor.id} className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-3 mb-4">
                      {tutor.teacherProfile ? (
                        <img 
                          src={tutor.teacherProfile} 
                          alt={tutor.teacher}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827]">{tutor.teacher}</h3>
                        <p className="text-sm text-[#6B7280]">{tutor.subject}</p>
                      </div>
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Status:</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Fee:</span>
                        <span className="font-medium">{tutor.fee}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Started:</span>
                        <span className="font-medium">{new Date(tutor.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-[#5B3DF5] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#4B2BBF] transition-colors flex items-center justify-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>Join Class</span>
                      </button>
                      <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Tutors */}
            {!isLoading && !isError && myTutors.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">No Active Tutors</h3>
                <p className="text-[#6B7280] mb-6">You don't have any active tutors yet. Start by finding and connecting with teachers.</p>
                <button 
                  className="px-6 py-3 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors"
                  onClick={() => window.location.href = '/dashboard/parent/find-teachers'}
                >
                  Find Teachers
                </button>
              </div>
            )}
          </div>
    </ParentLayout>
  );
};

export default MyTutors;