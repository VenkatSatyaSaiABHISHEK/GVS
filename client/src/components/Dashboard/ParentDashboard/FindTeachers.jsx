import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  MapPin,
  ChevronRight,
  User,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  Star,
  Loader2,
  X
} from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTutors, getTutorDetails, createTuitionRequest, compareTutors } from "@/services/tuitionServices";
import { toast } from "sonner";
import ParentLayout from "./ParentLayout";

const FindTeachers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTutorId = searchParams.get('tutorId');
  const [filters, setFilters] = useState({
    subject: "",
    city: "",
    experience: "",
    mode: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState({
    online: false,
    offline: false,
    verified: false,
    rating: false
  });
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [loadingTutor, setLoadingTutor] = useState(false);
  const [bookingSubject, setBookingSubject] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [autoOpenedTutor, setAutoOpenedTutor] = useState(false);

  const { data: compareData, isFetching: isComparing, refetch: runCompare } = useQuery({
    queryKey: ["teacher-compare", selectedForCompare],
    queryFn: () => compareTutors(selectedForCompare),
    enabled: false,
  });

  // Fetch teachers data using React Query
  const { data: teachersResponse, isLoading, isError, error } = useQuery({
    queryKey: ["teachers", filters, searchQuery, currentPage],
    queryFn: () => getTutors({ 
      ...filters, 
      subject: searchQuery || filters.subject,
      page: currentPage,
      limit: 12 
    }),
    placeholderData: keepPreviousData
  });

  const tutors = teachersResponse?.tutors || [];
  const totalTeachers = teachersResponse?.pagination?.total || 0;

  const filteredTutors = useMemo(() => {
    let items = [...tutors];

    if (showFilters.online && !showFilters.offline) {
      items = items.filter((item) => String(item.teachingMode || "").toLowerCase().includes("online"));
    }
    if (showFilters.offline && !showFilters.online) {
      items = items.filter((item) => String(item.teachingMode || "").toLowerCase().includes("offline"));
    }
    if (showFilters.verified) {
      items = items.filter((item) => Number(item.rating || 0) >= 4.5);
    }

    const sortBy = filters.sortBy || "newest";
    if (sortBy === "rating") {
      items.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sortBy === "price_low") {
      items.sort((a, b) => Number(a.hourlyRate || 0) - Number(b.hourlyRate || 0));
    } else if (sortBy === "price_high") {
      items.sort((a, b) => Number(b.hourlyRate || 0) - Number(a.hourlyRate || 0));
    }

    return items;
  }, [tutors, showFilters, filters.sortBy]);

  useEffect(() => {
    if (!preselectedTutorId || autoOpenedTutor || isLoading) return;
    const matchedTutor = tutors.find((item) => String(item.id) === String(preselectedTutorId));
    if (matchedTutor) {
      handleViewProfile(matchedTutor);
      setAutoOpenedTutor(true);
    }
  }, [preselectedTutorId, autoOpenedTutor, tutors, isLoading]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const toggleCompare = (teacherId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(teacherId)) return prev.filter((id) => id !== teacherId);
      if (prev.length >= 5) {
        toast.error("You can compare up to 5 teachers");
        return prev;
      }
      return [...prev, teacherId];
    });
  };

  const handleCompareNow = async () => {
    if (selectedForCompare.length < 2) {
      toast.error("Select at least 2 teachers to compare");
      return;
    }
    await runCompare();
  };

  const handleViewProfile = async (tutor) => {
    try {
      setLoadingTutor(true);
      setShowTutorModal(true);
      const data = await getTutorDetails(tutor.id);
      setSelectedTutor(data.tutor || tutor);
    } catch (err) {
      setSelectedTutor(tutor); // fallback to list data
    } finally {
      setLoadingTutor(false);
    }
  };

  const handleBookDemo = async (tutor) => {
    setSelectedTutor(tutor);
    setShowTutorModal(true);
    setBookingSubject(tutor.primarySubject || "");
  };

  const handleSubmitBooking = async () => {
    if (!selectedTutor || !bookingSubject) {
      toast.error("Please select a subject");
      return;
    }
    try {
      setIsBooking(true);
      await createTuitionRequest({
        teacherId: selectedTutor.id,
        subject: bookingSubject,
        message: bookingMessage,
        mode: selectedTutor.teachingMode || "Hybrid",
        classLevel: "General",
      });
      toast.success("Tuition request sent successfully!");
      setShowTutorModal(false);
      setBookingSubject("");
      setBookingMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setIsBooking(false);
    }
  };

  if (isError) {
    return (
      <ParentLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading teachers</p>
            <p className="text-gray-600">{error?.message || "Please try again later"}</p>
          </div>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>

          <div className="p-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 min-w-[150px]">
                  <MapPin className="h-4 w-4 text-[#6B7280]" />
                  <select 
                    className="border-0 focus:outline-none text-sm"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  >
                    <option value="">Around You</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by subject, teacher name, or keyword..."
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <button 
                  className="flex items-center space-x-2 px-4 py-3 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-sm"
                  onClick={() => setShowFilters(prev => ({ ...prev, showPanel: !prev.showPanel }))}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
                
                <button 
                  className="px-6 py-3 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors text-sm font-medium"
                  onClick={handleSearch}
                >
                  Find
                </button>
              </div>
            </div>

            {/* Suggestion Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {["Your Subject", "Math Teacher", "Physics Teacher", "Chemistry Teacher", "English Tutor", "Programming Teacher"].map((tag, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">
                  {isLoading ? "Loading..." : `Showing ${filteredTutors.length} Teachers Results`}
                </h2>
                <p className="text-sm text-[#6B7280]">Based on your preferences • Total {totalTeachers}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Filter Toggles */}
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      showFilters.online ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setShowFilters(prev => ({ ...prev, online: !prev.online }))}
                  >
                    Online
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      showFilters.offline ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setShowFilters(prev => ({ ...prev, offline: !prev.offline }))}
                  >
                    Offline
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      showFilters.verified ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setShowFilters(prev => ({ ...prev, verified: !prev.verified }))}
                  >
                    Verified
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <select 
                  className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  value={filters.sortBy || "newest"}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Lowest Price</option>
                  <option value="price_high">Highest Price</option>
                </select>
                
                {/* View Mode Toggle */}
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

            {selectedForCompare.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] mb-6 flex items-center justify-between">
                <p className="text-sm text-[#111827]">
                  Selected for compare: <span className="font-semibold">{selectedForCompare.length}</span>
                </p>
                <button
                  onClick={handleCompareNow}
                  disabled={isComparing || selectedForCompare.length < 2}
                  className="px-4 py-2 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors text-sm disabled:opacity-50"
                >
                  {isComparing ? "Comparing..." : "Compare Teachers"}
                </button>
              </div>
            )}

            {compareData?.teachers?.length >= 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] mb-6">
                <h3 className="text-base font-semibold text-[#111827] mb-4">Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {compareData.teachers.map((teacher) => (
                    <div key={teacher.id} className="border border-[#E5E7EB] rounded-xl p-4">
                      <p className="font-semibold text-[#111827]">{teacher.fullName}</p>
                      <p className="text-sm text-[#6B7280]">{teacher.primarySubject || "Subject N/A"}</p>
                      <p className="text-sm mt-2">Rating: <span className="font-medium">{teacher.rating || 0}</span></p>
                      <p className="text-sm">Experience: <span className="font-medium">{teacher.yoe || 0} years</span></p>
                      <p className="text-sm">Rate: <span className="font-medium">₹{teacher.hourlyRate || "N/A"}/hr</span></p>
                      <p className="text-sm">Success: <span className="font-medium">{teacher.successRate || 0}%</span></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#5B3DF5]" />
                <span className="ml-2 text-[#6B7280]">Loading teachers...</span>
              </div>
            )}

            {/* Teachers Grid */}
            {!isLoading && filteredTutors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredTutors.map((tutor) => (
                  <div key={tutor.id} className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all">
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => toggleCompare(tutor.id)}
                        className={`px-2 py-1 text-xs rounded-full border ${
                          selectedForCompare.includes(tutor.id)
                            ? "bg-[#5B3DF5] text-white border-[#5B3DF5]"
                            : "border-[#E5E7EB] text-[#6B7280]"
                        }`}
                      >
                        {selectedForCompare.includes(tutor.id) ? "Selected" : "Compare"}
                      </button>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      {tutor.profilePic ? (
                        <img 
                          src={tutor.profilePic} 
                          alt={tutor.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827]">{tutor.fullName}</h3>
                        <p className="text-sm text-[#6B7280]">{tutor.primarySubject}</p>
                      </div>
                      {tutor.rating >= 4.5 && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Experience:</span>
                        <span className="font-medium">{tutor.yoe || 0} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{tutor.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Students:</span>
                        <span className="font-medium">{tutor.studentsTaught || 0} students</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Location:</span>
                        <span className="font-medium">{tutor.city || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{tutor.bio || 'Experienced teacher'}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#5B3DF5]">₹{tutor.hourlyRate || 'N/A'}/hour</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tutor.teachingMode === 'Online' ? 'bg-blue-100 text-blue-600' :
                        tutor.teachingMode === 'Offline' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {tutor.teachingMode || 'Hybrid'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProfile(tutor)}
                        className="flex-1 bg-[#5B3DF5] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#4B2BBF] transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleBookDemo(tutor)}
                        className="flex-1 border border-[#E5E7EB] text-[#6B7280] py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Book Demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredTutors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6B7280] mb-2">No teachers found matching your criteria</p>
                <p className="text-sm text-[#6B7280]">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredTutors.length > 0 && (
              <div className="flex items-center justify-center space-x-2">
                <button 
                  className="flex items-center space-x-1 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      currentPage === page 
                        ? 'bg-[#5B3DF5] text-white' 
                        : 'border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="flex items-center space-x-1 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        {/* Teacher Profile / Booking Modal */}
        {showTutorModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedTutor ? selectedTutor.fullName : 'Teacher Profile'}
                </h3>
                <button
                  onClick={() => { setShowTutorModal(false); setSelectedTutor(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingTutor ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#5B3DF5]" />
                </div>
              ) : selectedTutor ? (
                <div className="p-6 space-y-4">
                  {/* Profile Info */}
                  <div className="flex items-center gap-4">
                    {selectedTutor.profilePic ? (
                      <img src={selectedTutor.profilePic} alt={selectedTutor.fullName} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-bold">{selectedTutor.fullName}</h4>
                      <p className="text-sm text-gray-500">{selectedTutor.primarySubject} • {selectedTutor.city || 'N/A'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{selectedTutor.rating || 0}</span>
                        <span className="text-xs text-gray-400">({selectedTutor.totalReviews || 0} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Experience</span><p className="font-medium">{selectedTutor.yoe || 0} years</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Rate</span><p className="font-medium">₹{selectedTutor.hourlyRate || 'N/A'}/hr</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Mode</span><p className="font-medium">{selectedTutor.teachingMode || 'Hybrid'}</p></div>
                    <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Students</span><p className="font-medium">{selectedTutor.studentsTaught || 0}</p></div>
                  </div>

                  {selectedTutor.bio && <p className="text-sm text-gray-600">{selectedTutor.bio}</p>}

                  {/* Booking Form */}
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold text-gray-800">Book a Tuition Session</h4>
                    <input
                      type="text"
                      placeholder="Subject (e.g. Mathematics)"
                      value={bookingSubject}
                      onChange={(e) => setBookingSubject(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm"
                    />
                    <textarea
                      placeholder="Message to teacher (optional)"
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm resize-none"
                    />
                    <button
                      onClick={handleSubmitBooking}
                      disabled={isBooking}
                      className="w-full bg-[#5B3DF5] text-white py-3 rounded-lg font-medium hover:bg-[#4B2BBF] transition-colors disabled:opacity-50"
                    >
                      {isBooking ? 'Sending Request...' : 'Send Tuition Request'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
    </ParentLayout>
  );
};

export default FindTeachers;