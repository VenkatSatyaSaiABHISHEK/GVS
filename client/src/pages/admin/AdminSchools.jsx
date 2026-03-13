import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  School,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  Clock
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

const AdminSchools = () => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axiosInstance.get('/admin/users?role=recruiter');
      if (response.data.success) {
        setSchools(response.data.data.users || []);
      }
    } catch (error) {
      toast.error('Failed to fetch schools');
      console.error('Schools fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSchool = async (schoolId) => {
    try {
      await axiosInstance.patch(`/admin/users/${schoolId}/status`, {
        isVerified: true,
        status: 'approved'
      });
      toast.success('School approved successfully');
      fetchSchools();
    } catch (error) {
      toast.error('Failed to approve school');
    }
  };

  const handleRejectSchool = async (schoolId) => {
    try {
      await axiosInstance.patch(`/admin/users/${schoolId}/status`, {
        status: 'rejected'
      });
      toast.success('School rejected');
      fetchSchools();
    } catch (error) {
      toast.error('Failed to reject school');
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'approved' && school.isVerified) ||
                         (filterStatus === 'pending' && !school.isVerified) ||
                         (filterStatus === 'rejected' && school.status === 'rejected');
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schools Management</h1>
          <p className="text-gray-600 mt-1">Manage and approve schools on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-[#6C5CE7] to-[#5A4FCF]">
            <Building className="w-4 h-4 mr-2" />
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] rounded-2xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {schools.filter(s => s.isVerified).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {schools.filter(s => !s.isVerified && s.status !== 'rejected').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">89</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search schools by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('approved')}
                size="sm"
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('rejected')}
                size="sm"
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schools List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Schools List</CardTitle>
          <CardDescription>All registered schools on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSchools.map((school, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {school.fullName?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{school.fullName || 'N/A'}</h3>
                      <Badge variant={school.isVerified ? "success" : school.status === 'rejected' ? "destructive" : "secondary"}>
                        {school.isVerified ? "Approved" : school.status === 'rejected' ? "Rejected" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {school.email}
                      </div>
                      {school.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {school.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(school.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {!school.isVerified && school.status !== 'rejected' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveSchool(school.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {!school.isVerified && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRejectSchool(school.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredSchools.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No schools found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSchools;