import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Clock
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users?role=jobSeeker');
      if (response.data.success) {
        setTeachers(response.data.data.users || []);
      }
    } catch (error) {
      toast.error('Failed to fetch teachers');
      console.error('Teachers fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTeacher = async (teacherId) => {
    try {
      await axiosInstance.patch(`/admin/users/${teacherId}/status`, {
        isVerified: true
      });
      toast.success('Teacher verified successfully');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to verify teacher');
    }
  };

  const handleSuspendTeacher = async (teacherId) => {
    try {
      await axiosInstance.patch(`/admin/users/${teacherId}/status`, {
        status: 'suspended'
      });
      toast.success('Teacher suspended successfully');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to suspend teacher');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && teacher.isVerified) ||
                         (filterStatus === 'pending' && !teacher.isVerified) ||
                         (filterStatus === 'suspended' && teacher.status === 'suspended');
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
          <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
          <p className="text-gray-600 mt-1">Manage and verify teachers on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-[#6C5CE7] to-[#5A4FCF]">
            <UserCheck className="w-4 h-4 mr-2" />
            Bulk Verify
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#5A4FCF] rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {teachers.filter(t => t.isVerified).length}
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
                  {teachers.filter(t => !t.isVerified).length}
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
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
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
                  placeholder="Search teachers by name or email..."
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
                variant={filterStatus === 'verified' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('verified')}
                size="sm"
              >
                Verified
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'suspended' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('suspended')}
                size="sm"
              >
                Suspended
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
          <CardDescription>All registered teachers on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#5A4FCF] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {teacher.fullName?.charAt(0) || 'T'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{teacher.fullName || 'N/A'}</h3>
                      <Badge variant={teacher.isVerified ? "success" : "secondary"}>
                        {teacher.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {teacher.email}
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {teacher.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(teacher.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {!teacher.isVerified && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerifyTeacher(teacher.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleSuspendTeacher(teacher.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Suspend
                  </Button>
                </div>
              </div>
            ))}
            {filteredTeachers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No teachers found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeachers;