import React, { useState } from "react";
import { 
  User,
  Star,
  Filter,
  Grid3X3,
  List,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTutors } from "@/services/tuitionServices";
import ParentLayout from "./ParentLayout";

const RecommendedTeachers = () => {
  const [viewMode, setViewMode] = useState("grid");

  // Fetch recommended teachers
  const { data: teachersResponse, isLoading, isError } = useQuery({
    queryKey: ["recommended-teachers"],
    queryFn: () => getTutors({ limit: 12 })
  });

  const recommendedTeachers = teachersResponse?.data || [];

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-2">
                  Recommended for You ({isLoading ? "..." : recommendedTeachers.length})
                </h2>
                <p className="text-[#6B7280]">Teachers matched to your preferences and requirements</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-sm">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
                
                <div className="flex items-center border border-[#E5E7EB] rounded-lg">
                  <button
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#5B3DF5] text-white' : 'text-gray-600'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    className={`p-2 ${viewMode === 'list' ? 'bg-[#5B3DF5] text-white' : 'text-gray-600'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#5B3DF5]" />
                <span className="ml-2 text-[#6B7280]">Loading recommended teachers...</span>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-2">Error loading recommended teachers</p>
                <p className="text-gray-600">Please try again later</p>
              </div>
            )}

            {/* Teachers Grid */}
            {!isLoading && !isError && recommendedTeachers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-3 mb-4">
                      {teacher.profileImage ? (
                        <img 
                          src={teacher.profileImage} 
                          alt={teacher.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827]">{teacher.name}</h3>
                        <p className="text-sm text-[#6B7280]">{teacher.subject}</p>
                      </div>
                      {teacher.verified && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Experience:</span>
                        <span className="font-medium">{teacher.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{teacher.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Students:</span>
                        <span className="font-medium">{teacher.studentsCount} students</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Location:</span>
                        <span className="font-medium">{teacher.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{teacher.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#5B3DF5]">{teacher.fee}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModeColor(teacher.mode)}`}>
                        {teacher.mode}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-[#5B3DF5] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#4B2BBF] transition-colors">
                        View Profile
                      </button>
                      <button className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Save Teacher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Teachers */}
            {!isLoading && !isError && recommendedTeachers.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">No Recommendations Yet</h3>
                <p className="text-[#6B7280] mb-6">We're working on finding the best teachers for you. Check back soon or browse all teachers.</p>
                <button 
                  className="px-6 py-3 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors"
                  onClick={() => window.location.href = '/dashboard/parent/find-teachers'}
                >
                  Browse All Teachers
                </button>
              </div>
            )}
          </div>
    </ParentLayout>
  );
};

export default RecommendedTeachers;