import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Plus,
  User,
  Linkedin,
  Youtube,
  Globe,
  FileText,
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import DashboardLayout from '@/components/Dashboard/TeacherDashboard/DashboardLayout';

// Indian States
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Major Indian Cities
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
  'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh',
  'Guwahati', 'Solapur', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly',
  'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem',
  'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner',
  'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad',
  'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
  'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar',
  'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj',
  'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon',
  'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala'
].sort();

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();
  const [availableForHire, setAvailableForHire] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [portfolioLinks, setPortfolioLinks] = useState({
    linkedin: '',
    youtube: '',
    website: '',
    portfolio: ''
  });

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    retypePassword: '',
    mobile: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    state: '',
    primarySubject: '',
    secondarySubjects: '',
    experience: '',
    qualification: '',
    teachingMode: 'Hybrid',
    hourlyRate: '',
    about: '',
  });

  const [skills, setSkills] = useState([
    { name: 'Subject Knowledge', level: 90 },
    { name: 'Communication', level: 85 },
    { name: 'Online Teaching', level: 80 },
    { name: 'Classroom Management', level: 88 },
  ]);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      const nameParts = user.fullName?.split(' ') || ['', '', ''];
      setFormData({
        firstName: nameParts[0] || '',
        middleName: nameParts[1] || '',
        lastName: nameParts[2] || '',
        username: user.email?.split('@')[0] || '',
        password: '',
        retypePassword: '',
        mobile: user.contact || '',
        whatsapp: user.contact || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        primarySubject: user.primarySubject || '',
        secondarySubjects: user.secondarySubjects || '',
        experience: user.yoe || '',
        qualification: user.qualification || '',
        teachingMode: user.teachingMode || 'Hybrid',
        hourlyRate: user.hourlyRate || '',
        about: user.bio || '',
      });
      
      if (user.skills && user.skills.length > 0) {
        setSkills(user.skills.map(skill => ({
          name: typeof skill === 'string' ? skill : skill.name,
          level: skill.level || 50
        })));
      }
      
      if (user.profileLinks) {
        setPortfolioLinks({
          linkedin: user.profileLinks.linkedIn || '',
          youtube: user.profileLinks.youtube || '',
          website: user.profileLinks.website || '',
          portfolio: user.profileLinks.portfolio || ''
        });
      }
      
      setProfileImage(user.profilePic || null);
      setAvailableForHire(user.availableForHire !== false);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    console.log(`Input changed - Field: ${field}, Value: ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const addNewSkill = () => {
    setSkills([...skills, { name: 'New Skill', level: 50 }]);
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handlePortfolioChange = (field, value) => {
    setPortfolioLinks(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('profilePic', file);

      const response = await axiosInstance.put('/user/profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setProfileImage(response.data.profilePic);
        toast.success('Profile picture updated successfully!');
        await refetchUser();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      profileImage,
      formData.firstName,
      formData.email,
      formData.mobile,
      formData.city,
      formData.state,
      formData.primarySubject,
      formData.qualification,
      formData.experience,
      formData.about,
      skills.length > 0,
      portfolioLinks.linkedin || portfolioLinks.youtube || portfolioLinks.website
    ];
    
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleSave = async () => {
    try {
      console.log('handleSave called');
      
      // Validation
      if (formData.password && formData.password !== formData.retypePassword) {
        toast.error('Passwords do not match!');
        return;
      }

      if (!formData.firstName || !formData.email) {
        toast.error('First name and email are required!');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone number
      if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      setIsSaving(true);
      console.log('Saving profile data:', formData);

      // Prepare data for API
      const updateData = {
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        bio: formData.about,
        yoe: formData.experience,
        primarySubject: formData.primarySubject,
        secondarySubjects: formData.secondarySubjects,
        qualification: formData.qualification,
        teachingMode: formData.teachingMode,
        hourlyRate: formData.hourlyRate,
        skills: skills,
        availableForHire: availableForHire,
        profileLinks: {
          linkedIn: portfolioLinks.linkedin,
          youtube: portfolioLinks.youtube,
          website: portfolioLinks.website,
          portfolio: portfolioLinks.portfolio
        }
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      console.log('Sending update data:', updateData);

      // Call API to update profile
      const response = await axiosInstance.put('/user/profile-update', updateData);

      console.log('API response:', response.data);

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        // Refetch user data
        await refetchUser();
        // Clear password fields
        setFormData(prev => ({ ...prev, password: '', retypePassword: '' }));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      const nameParts = user.fullName?.split(' ') || ['', '', ''];
      setFormData({
        firstName: nameParts[0] || '',
        middleName: nameParts[1] || '',
        lastName: nameParts[2] || '',
        username: user.email?.split('@')[0] || '',
        password: '',
        retypePassword: '',
        mobile: user.contact || '',
        whatsapp: user.contact || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        primarySubject: user.primarySubject || '',
        secondarySubjects: user.secondarySubjects || '',
        experience: user.yoe || '',
        qualification: user.qualification || '',
        teachingMode: user.teachingMode || 'Hybrid',
        hourlyRate: user.hourlyRate || '',
        about: user.bio || '',
      });
      
      if (user.skills && user.skills.length > 0) {
        setSkills(user.skills.map(skill => ({
          name: typeof skill === 'string' ? skill : skill.name,
          level: skill.level || 50
        })));
      }
      
      if (user.profileLinks) {
        setPortfolioLinks({
          linkedin: user.profileLinks.linkedIn || '',
          youtube: user.profileLinks.youtube || '',
          website: user.profileLinks.website || '',
          portfolio: user.profileLinks.portfolio || ''
        });
      }
      
      setAvailableForHire(user.availableForHire !== false);
    }
    toast.info('Changes cancelled');
  };

  const handleBack = () => {
    navigate('/dashboard/teacher');
  };

  // Profile completion calculation
  const profileCompletion = calculateProfileCompletion();
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="flex gap-6 p-6 bg-[#F7F8FC] min-h-screen">
        {/* Left Column - Edit Form (70%) */}
        <div className="flex-1 max-w-[70%]">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Available for Hiring</span>
                <Switch
                  checked={availableForHire}
                  onCheckedChange={setAvailableForHire}
                  className="data-[state=checked]:bg-[#6C5CE7]"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-xl px-6"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  className="rounded-xl px-6 bg-gradient-to-r from-[#6C5CE7] to-[#A78BFA] hover:from-[#5B4DD6] hover:to-[#9678E9]"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>

          {/* GENERALS Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              GENERALS
            </h3>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter middle name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 pr-12 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-[#6C5CE7] text-xs font-bold"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Re-Type Password</label>
                <input
                  type={showRetypePassword ? 'text' : 'password'}
                  value={formData.retypePassword}
                  onChange={(e) => handleInputChange('retypePassword', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 pr-12 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute right-0 bottom-2 text-[#6C5CE7] text-xs font-bold"
                >
                  {showRetypePassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>
          </div>

          {/* CONTACT Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              CONTACT
            </h3>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Mobile Phone</label>
                <Phone className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none pl-6 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Whatsapp</label>
                <MessageCircle className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none pl-6 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter WhatsApp number"
                />
              </div>
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <Mail className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none pl-6 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Address</label>
                <MapPin className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none pl-6 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">City</label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                  <SelectTrigger className="border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {INDIAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">State</label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className="border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Teaching Details Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              TEACHING DETAILS
            </h3>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Primary Subject</label>
                <input
                  type="text"
                  value={formData.primarySubject}
                  onChange={(e) => handleInputChange('primarySubject', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Secondary Subjects</label>
                <input
                  type="text"
                  value={formData.secondarySubjects}
                  onChange={(e) => handleInputChange('secondarySubjects', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="e.g., Physics, Chemistry"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="e.g., B.Ed, M.Sc"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Teaching Mode</label>
                <Select value={formData.teachingMode} onValueChange={(value) => handleInputChange('teachingMode', value)}>
                  <SelectTrigger className="border-0 border-b border-gray-300 rounded-none px-0 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5CE7] text-gray-900 bg-transparent"
                  placeholder="e.g., 500"
                />
              </div>
            </div>
          </div>

          {/* ABOUT ME Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              ABOUT ME
            </h3>
            <textarea
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              placeholder="Tell about your teaching experience, subjects you teach, achievements, and teaching style."
              className="w-full min-h-32 rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-1 focus:ring-[#6C5CE7] text-gray-900 bg-transparent resize-none"
              rows={5}
            />
          </div>

          {/* SKILLS Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                SKILLS
              </h3>
              <button
                type="button"
                onClick={addNewSkill}
                className="flex items-center gap-2 text-[#6C5CE7] text-sm font-semibold hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add New Skills
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                      className="text-gray-900 font-medium border-0 px-0 py-1 focus:outline-none bg-transparent"
                      placeholder="Skill name"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-semibold">{skill.level}%</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #6C5CE7 0%, #6C5CE7 ${skill.level}%, #E5E7EB ${skill.level}%, #E5E7EB 100%)`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Profile Summary (30%) */}
      <div className="w-[30%]">
        <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-6">
          {/* Profile Avatar with Progress Circle */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-36 h-36 mb-4">
              <svg className="transform -rotate-90 w-36 h-36">
                <circle cx="72" cy="72" r={radius} stroke="#E5E7EB" strokeWidth="6" fill="none" />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#6C5CE7"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <label htmlFor="profile-upload" className="cursor-pointer group">
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden relative">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-14 h-14 text-gray-500" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                        {isUploadingImage ? 'Uploading...' : 'Change'}
                      </span>
                    </div>
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                <span className="text-sm font-bold text-[#6C5CE7]">{profileCompletion}%</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {formData.firstName} {formData.lastName || user?.fullName || 'Teacher'}
            </h3>
            <p className="text-sm text-gray-500">{formData.primarySubject || 'Subject Teacher'}</p>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{user?.applications?.length || 0}</p>
              <p className="text-xs text-gray-500">Applications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{user?.interviews || 0}</p>
              <p className="text-xs text-gray-500">Interviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{user?.profileViews || 0}</p>
              <p className="text-xs text-gray-500">Profile Views</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formData.mobile || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formData.email || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Subject Skill Circles */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Top Skills</h4>
            <div className="flex justify-around">
              {skills.slice(0, 3).map((skill, index) => {
                const colors = ['#FF9F43', '#2ECC71', '#4ECDC4'];
                const r = 35;
                const circ = 2 * Math.PI * r;
                const offset = circ - (skill.level / 100) * circ;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <svg className="transform -rotate-90 w-24 h-24">
                        <circle cx="48" cy="48" r={r} stroke="#E5E7EB" strokeWidth="6" fill="none" />
                        <circle
                          cx="48"
                          cy="48"
                          r={r}
                          stroke={colors[index]}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={circ}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{skill.level}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">{skill.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Portfolios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Portfolio Links</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">LinkedIn</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    value={portfolioLinks.linkedin}
                    onChange={(e) => handlePortfolioChange('linkedin', e.target.value)}
                    placeholder="LinkedIn profile URL"
                    className="flex-1 text-sm text-gray-600 border-0 border-b border-gray-200 focus:border-[#6C5CE7] focus:outline-none bg-transparent px-0 py-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">YouTube</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-4 h-4 text-red-600" />
                  </div>
                  <input
                    type="text"
                    value={portfolioLinks.youtube}
                    onChange={(e) => handlePortfolioChange('youtube', e.target.value)}
                    placeholder="YouTube channel URL"
                    className="flex-1 text-sm text-gray-600 border-0 border-b border-gray-200 focus:border-[#6C5CE7] focus:outline-none bg-transparent px-0 py-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Website</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <input
                    type="text"
                    value={portfolioLinks.website}
                    onChange={(e) => handlePortfolioChange('website', e.target.value)}
                    placeholder="Personal website URL"
                    className="flex-1 text-sm text-gray-600 border-0 border-b border-gray-200 focus:border-[#6C5CE7] focus:outline-none bg-transparent px-0 py-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Portfolio</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-pink-600" />
                  </div>
                  <input
                    type="text"
                    value={portfolioLinks.portfolio}
                    onChange={(e) => handlePortfolioChange('portfolio', e.target.value)}
                    placeholder="Teaching portfolio URL"
                    className="flex-1 text-sm text-gray-600 border-0 border-b border-gray-200 focus:border-[#6C5CE7] focus:outline-none bg-transparent px-0 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherProfile;
