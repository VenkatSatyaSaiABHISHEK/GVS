import { useQuery } from "@tanstack/react-query";
import { getJobsForTeacher } from "@/services/tuitionServices";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Briefcase, MapPin, Search, SlidersHorizontal, Grid3x3, List,
    ChevronRight, Building2, AlertCircle
} from "lucide-react";
import { useState } from "react";
import TeacherLayout from "./TeacherDashboard/TeacherLayout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TeacherJobsPanel = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        subject: "",
        location: "",
        salaryMin: "",
        jobType: "",
        sortBy: "newest"
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [showFulltime, setShowFulltime] = useState(true);
    const [showFreelance, setShowFreelance] = useState(true);

    const { data: jobsData, isLoading, isError, error } = useQuery({
        queryKey: ["teacher-jobs", filters, searchQuery],
        queryFn: () => getJobsForTeacher({ ...filters, subject: searchQuery || undefined }),
        retry: false
    });

    const jobs = jobsData?.jobs || [];
    const totalJobs = jobs.length;

    const skillSuggestions = [
        "Mathematics",
        "Physics",
        "Chemistry",
        "English",
        "Computer Science"
    ];

    const handleSearch = () => {
        // searchQuery is already included in the queryKey, so React Query auto-refetches
    };

    return (
        <TeacherLayout>
            <div className="p-8 space-y-6 bg-[#F7F8FC] min-h-screen">
                {/* Search Bar Section */}
                <div className="bg-white rounded-3xl p-6 shadow-md">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Location Dropdown */}
                        <div className="w-full lg:w-48">
                            <Select 
                                value={filters.location} 
                                onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                            >
                                <SelectTrigger className="rounded-xl border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <SelectValue placeholder="Around You" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="mumbai">Mumbai</SelectItem>
                                    <SelectItem value="bangalore">Bangalore</SelectItem>
                                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Main Search Input */}
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Title, Company or any jobs keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
                            />
                        </div>

                        {/* Filter Button */}
                        <Button
                            variant="outline"
                            className="rounded-xl px-6 py-3 border-gray-200 hover:bg-gray-50"
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            FILTER
                        </Button>

                        {/* Find Button */}
                        <Button
                            onClick={handleSearch}
                            className="rounded-xl px-8 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8B7FE8] hover:from-[#5B4CC2] hover:to-[#7A6ED7]"
                        >
                            FIND
                        </Button>
                    </div>
                </div>

                {/* Skill Suggestions */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h3>
                    <div className="flex flex-wrap gap-2">
                        {skillSuggestions.map((skill, index) => (
                            <button
                                key={index}
                                onClick={() => setSearchQuery(skill)}
                                className="px-4 py-2 bg-[#6C5DD3] bg-opacity-10 text-[#6C5DD3] rounded-full text-sm font-medium hover:bg-opacity-20 transition-all"
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Header with Filters */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Showing {totalJobs} Jobs Results
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Based on your preferences</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Job Type Toggles */}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showFulltime}
                                    onChange={(e) => setShowFulltime(e.target.checked)}
                                    className="w-4 h-4 rounded accent-[#6C5DD3]"
                                />
                                <span className="text-sm font-medium text-gray-700">Fulltime</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showFreelance}
                                    onChange={(e) => setShowFreelance(e.target.checked)}
                                    className="w-4 h-4 rounded accent-[#6C5DD3]"
                                />
                                <span className="text-sm font-medium text-gray-700">Freelance</span>
                            </label>
                        </div>

                        {/* Sort Dropdown */}
                        <Select 
                            value={filters.sortBy} 
                            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                        >
                            <SelectTrigger className="w-32 rounded-xl border-gray-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="salary-high">Salary: High</SelectItem>
                                <SelectItem value="salary-low">Salary: Low</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Mode Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-[#6C5DD3] text-white" : "bg-gray-100 text-gray-600"}`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-[#6C5DD3] text-white" : "bg-gray-100 text-gray-600"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5DD3] mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading jobs...</p>
                    </div>
                ) : isError ? (
                    <div className="bg-white rounded-3xl p-20 text-center shadow-md">
                        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                        <p className="text-gray-700 text-lg font-semibold">Error loading jobs</p>
                        <p className="text-gray-400 text-sm mt-2">{error?.message || "Please try again later"}</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center shadow-md">
                        <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No jobs found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => navigate(`/dashboard/teacher/jobs/${job.id}`)}
                                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                            >
                                {/* Company Logo and Name */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {job.companyName || "School Name"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Title */}
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#6C5DD3] transition-colors">
                                    {job.title}
                                </h3>

                                {/* Salary */}
                                <p className="text-xl font-bold text-gray-800 mb-3">
                                    {job.salaryRange?.min && job.salaryRange?.max 
                                        ? `₹${parseInt(job.salaryRange.min).toLocaleString()} - ₹${parseInt(job.salaryRange.max).toLocaleString()}`
                                        : "Salary not specified"}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                                    {job.description || "No description provided"}
                                </p>

                                {/* Job Type Badge and Location */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="px-4 py-1.5 bg-[#6C5DD3] bg-opacity-10 text-[#6C5DD3] rounded-lg text-xs font-semibold uppercase">
                                        {job.jobType || "Not specified"}
                                    </span>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {job.location?.city || "Location not specified"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {jobs.length > 0 && (
                    <div className="flex justify-between items-center pt-6">
                        <p className="text-sm text-gray-500">
                            Showing 10 from {totalJobs} data
                        </p>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-[#6C5DD3] text-white font-semibold hover:bg-[#5B4CC2] transition-colors">
                                1
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                                2
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                                3
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                                4
                            </button>
                            <button className="px-4 h-10 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1">
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
};

export default TeacherJobsPanel;
