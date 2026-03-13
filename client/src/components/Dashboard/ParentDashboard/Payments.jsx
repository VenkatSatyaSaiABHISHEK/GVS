import React from "react";
import { User, Download, Eye } from "lucide-react";
import ParentLayout from "./ParentLayout";

const Payments = () => {

  const payments = [
    { id: 1, teacher: "Rahul Sharma", subject: "Physics", amount: "₹2,400", date: "Dec 10, 2024", status: "Paid", sessions: 3 },
    { id: 2, teacher: "Priya Singh", subject: "Mathematics", amount: "₹1,800", date: "Dec 8, 2024", status: "Paid", sessions: 3 },
    { id: 3, teacher: "Amit Kumar", subject: "Chemistry", amount: "₹2,700", date: "Dec 5, 2024", status: "Pending", sessions: 3 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Paid": return "bg-green-100 text-green-600";
      case "Pending": return "bg-yellow-100 text-yellow-600";
      case "Failed": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <ParentLayout>
      <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#111827] mb-2">Payment History</h2>
              <p className="text-[#6B7280]">Track your tuition payments and invoices</p>
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                <h3 className="text-sm font-medium text-[#6B7280] mb-2">Total Spent</h3>
                <p className="text-2xl font-bold text-[#111827]">₹6,900</p>
                <p className="text-sm text-green-600 mt-1">This month</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                <h3 className="text-sm font-medium text-[#6B7280] mb-2">Pending Payments</h3>
                <p className="text-2xl font-bold text-[#111827]">₹2,700</p>
                <p className="text-sm text-yellow-600 mt-1">1 payment due</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]">
                <h3 className="text-sm font-medium text-[#6B7280] mb-2">Total Sessions</h3>
                <p className="text-2xl font-bold text-[#111827]">9</p>
                <p className="text-sm text-blue-600 mt-1">Completed</p>
              </div>
            </div>

            {/* Payment Table */}
            <div className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Teacher</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Sessions</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-[#111827]">{payment.teacher}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{payment.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{payment.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{payment.sessions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{payment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-[#5B3DF5] hover:text-[#4B2BBF] p-1">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-[#6B7280] hover:text-[#111827] p-1">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
    </ParentLayout>
  );
};

export default Payments;