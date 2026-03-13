import React from "react";
import { User, Star, MapPin, Heart, Trash2, Loader2, Bookmark } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getTutors } from "@/services/tuitionServices";
import { sendMessage } from "@/services/messageServices";
import { toast } from "sonner";
import ParentLayout from "./ParentLayout";

const SavedTeachers = () => {
  const navigate = useNavigate();
  // For now, we'll fetch recommended teachers as "saved" teachers
  // In a real app, you'd have a separate API for saved/bookmarked teachers
  const { data: teachersResponse, isLoading, isError } = useQuery({
    queryKey: ["saved-teachers"],
    queryFn: () => getTutors({ limit: 6 })
  });

  const savedTeachers = (teachersResponse?.tutors || teachersResponse?.data || []).map((teacher) => ({
    id: teacher.id,
    name: teacher.fullName || teacher.name || "Teacher",
    subject: teacher.primarySubject || teacher.subject || "Subject N/A",
    fee: teacher.hourlyRate ? `₹${teacher.hourlyRate}` : teacher.fee || "N/A",
    description: teacher.bio || teacher.description || "Experienced teacher",
    mode: teacher.teachingMode || teacher.mode || "Hybrid",
    rating: teacher.rating || 0,
    location: [teacher.city, teacher.state].filter(Boolean).join(", ") || teacher.location || "N/A",
    studentsCount: teacher.studentsTaught || teacher.studentsCount || 0,
    experience: teacher.yoe ? `${teacher.yoe} years` : teacher.experience || "N/A",
    savedDate: teacher.savedDate || "recently",
  }));

  const contactMutation = useMutation({
    mutationFn: (receiverId) => sendMessage({ receiverId, message: "Hi, I would like to discuss tuition classes." }),
    onSuccess: (_, receiverId) => {
      navigate(`/dashboard/parent/messages?userId=${receiverId}`);
      toast.success("Conversation opened");
    },
    onError: (error, receiverId) => {
      navigate(`/dashboard/parent/messages?userId=${receiverId}`);
      toast.error(error?.response?.data?.message || "Opened messages. Send your first message there.");
    },
  });

  const getModeColor = (mode) => {
    switch(mode) {
      case "ONLINE": return "bg-blue-100 text-blue-600";
      case "OFFLINE": return "bg-green-100 text-green-600";
      case "HOME TUTOR": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <ParentLayout>
      <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-10 text-[#6B7280]">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading saved teachers...
              </div>
            )}

            {isError && !isLoading && (
              <div className="bg-white rounded-2xl p-6 text-red-600 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                Failed to load saved teachers. Please refresh.
              </div>
            )}

            {!isLoading && !isError && (
              <>
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-2">
                Your Saved Teachers ({savedTeachers.length})
              </h2>
              <p className="text-[#6B7280]">Teachers you've bookmarked for future reference</p>
            </div>

            {savedTeachers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white rounded-2xl p-5 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all">
                    {/* Teacher Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#111827] text-sm">{teacher.name}</h3>
                          <p className="text-xs text-[#6B7280]">{teacher.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                        <button className="p-2 text-[#6B7280] hover:bg-gray-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Fee */}
                    <div className="mb-3">
                      <span className="text-lg font-bold text-[#5B3DF5]">{teacher.fee}</span>
                      <span className="text-sm text-[#6B7280]"> / hour</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                      {teacher.description}
                    </p>
                    
                    {/* Mode Tag */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModeColor(teacher.mode)}`}>
                        {teacher.mode}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-[#6B7280] mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="font-medium">{teacher.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{teacher.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-[#6B7280] mb-4">
                      <span className="font-medium">{teacher.studentsCount} students</span> • {teacher.experience}
                    </div>
                    
                    {/* Saved Date */}
                    <div className="text-xs text-[#6B7280] mb-4">
                      Saved {teacher.savedDate}
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/parent/find-teachers?tutorId=${teacher.id}`)}
                        className="flex-1 bg-[#5B3DF5] text-white py-2 px-3 rounded-[20px] text-xs font-medium hover:bg-[#4B2BBF] transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => contactMutation.mutate(teacher.id)}
                        className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-3 rounded-[20px] text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                <Bookmark className="h-16 w-16 mx-auto text-[#6B7280] mb-4" />
                <h3 className="text-lg font-semibold text-[#111827] mb-2">No Saved Teachers</h3>
                <p className="text-[#6B7280] mb-6">You haven't saved any teachers yet. Start exploring and save your favorites!</p>
                <Link
                  to="/dashboard/parent/find-teachers"
                  className="inline-flex items-center px-6 py-3 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors"
                >
                  Find Teachers
                </Link>
              </div>
            )}
            </>
            )}
          </div>
    </ParentLayout>
  );
};

export default SavedTeachers;