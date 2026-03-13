import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserApplications } from "@/services/applicationServices";
import TeacherLayout from "../TeacherDashboard/TeacherLayout";
import {
  Phone,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";

export default function AppliedJobs() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applied-jobs"],
    queryFn: getUserApplications,
    retry: false,
  });

  const applications = data?.applications || [];
  const totalApplications = applications.length;

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const styles = {
      applied: "bg-yellow-100 text-yellow-700",
      application_viewed: "bg-blue-100 text-blue-700",
      shortlisted: "bg-indigo-100 text-indigo-700",
      interview_scheduled: "bg-purple-100 text-purple-700",
      interview_completed: "bg-fuchsia-100 text-fuchsia-700",
      selected: "bg-cyan-100 text-cyan-700",
      offer_sent: "bg-orange-100 text-orange-700",
      hired: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[statusLower] || styles.applied;
  };

  const getJobTypeBadge = (type) => {
    const typeLower = type?.toLowerCase();
    const styles = {
      freelance: "bg-purple-100 text-purple-700",
      "part time": "bg-blue-100 text-blue-700",
      fulltime: "bg-green-100 text-green-700",
      "full time": "bg-green-100 text-green-700",
    };
    return styles[typeLower] || "bg-gray-100 text-gray-700";
  };

  return (
    <TeacherLayout>
      <div className="p-8 space-y-6 bg-[#F7F8FC] min-h-screen">
        {/* Summary Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Showing {filteredApplications.length} Applicants
            </h2>
            <p className="text-sm text-gray-500 mt-1">Based on your preferences</p>
          </div>
        </div>

        {/* Filter Tabs and Sort */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("applied")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "applied"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Applied
            </button>
            <button
              onClick={() => setStatusFilter("shortlisted")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "shortlisted"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => setStatusFilter("interview_scheduled")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "interview_scheduled"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Interview
            </button>
            <button
              onClick={() => setStatusFilter("offer_sent")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "offer_sent"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Offer
            </button>
            <button
              onClick={() => setStatusFilter("hired")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "hired"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Hired
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "rejected"
                  ? "bg-[#6C5DD3] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Rejected
            </button>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 rounded-xl border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications Table Card */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5DD3] mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading applications...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Error loading applications</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No applications found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="w-4 h-4 rounded accent-[#6C5DD3]" />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date Applied</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((application, index) => {
                    const job = application?.job;
                    
                    return (
                      <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded accent-[#6C5DD3]" />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          #APL-{String(index + 1).padStart(4, '0')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {moment(application?.appliedAt).format('MMMM D, YYYY, hh:mm A')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-[#6C5CE7]" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{job?.companyName || 'School'}</p>
                              <p className="text-xs text-gray-500">{job?.location?.city || 'Location'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getJobTypeBadge(job?.jobType)}`}>
                            {job?.jobType || 'FULLTIME'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {job?.title || 'Position Title'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border-2 border-[#6C5DD3] flex items-center justify-center hover:bg-[#6C5DD3] hover:text-white transition-colors">
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-full border-2 border-[#6C5DD3] flex items-center justify-center hover:bg-[#6C5DD3] hover:text-white transition-colors">
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(application?.status)}`}>
                            {application?.status || 'applied'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => window.location.href = `/dashboard/teacher/jobs/${job?.id}`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing 10 from {totalApplications} data
            </p>
            <div className="flex gap-2">
              <button className="px-4 h-10 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
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
}
