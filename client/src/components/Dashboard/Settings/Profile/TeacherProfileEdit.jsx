import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import TeacherLayout from "../../TeacherDashboard/TeacherLayout";
import {
  User, Phone, Mail, MapPin, Globe, Linkedin, Youtube, Plus, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { useNavigate } from 'react-router-dom';

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

const TeacherProfileEdit = () => {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableForHire, setAvailableForHire] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    primarySubject: '',
    secondarySubjects: '',
    experience: '',
    qualification: '',
    teachingMode: 'Hybrid',
    about: '',
  });

  // Skills state
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
        confirmPassword: '',
        mobile: user.contact || '',
        whatsapp: user.contact || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: 'India',
        primarySubject: user.primarySubject || '',
        secondarySubjects: user.secondarySubjects || '',
        experience: user.yoe || '',
        qualification: user.qualification || '',
        teachingMode: user.teachingMode || 'Hybrid',
        about: user.bio || '',
      });
      
      if (user.skills && user.skills.length > 0) {
        setSkills(user.skills.map(skill => ({
          name: typeof skill === 'string' ? skill : skill.name,
          level: skill.level || 50
        })));
      }
      
      setAvailableForHire(user.availableForHire !== false);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
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
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate passwords match if provided
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Prepare update data
      const updateData = {
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        contact: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        primarySubject: formData.primarySubject,
        secondarySubjects: formData.secondarySubjects,
        yoe: formData.experience,
        qualification: formData.qualification,
        teachingMode: formData.teachingMode,
        bio: formData.about,
        skills: skills,
        availableForHire: availableForHire,
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Call API to update profile
      const response = await axiosInstance.put('/user/profile-update', updateData);

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        await refetchUser();
        // Clear password fields
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/teacher');
  };

  const handleBack = () => {
    navigate('/dashboard/teacher');
  };

  // Calculate profile completion
  const profileCompletion = 85;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

  return (
    <TeacherLayout>
      <div className="p-8 space-y-6 bg-[#F7F8FC] min-h-screen">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Profile / <span className="text-gray-800 font-medium">Edit Profile</span>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-md">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Available for hire?</span>
                    <button
                      onClick={() => setAvailableForHire(!availableForHire)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        availableForHire ? 'bg-[#6C5DD3]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          availableForHire ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* General Information */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">General</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First Name"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      placeholder="Middle Name"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last Name"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Username"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                      disabled
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 mb-1 block">Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Password"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 pr-16 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-8 text-[#6C5DD3] text-xs font-semibold"
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 mb-1 block">Re-Type Password</label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Re-Type Password"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 pr-16 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-8 text-[#6C5DD3] text-xs font-semibold"
                    >
                      {showConfirmPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Contact</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <label className="text-sm text-gray-600 mb-1 block">Mobile Phone</label>
                    <Phone className="absolute left-0 bottom-2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="Mobile Phone"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 pl-6 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 mb-1 block">Whatsapp</label>
                    <Phone className="absolute left-0 bottom-2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="Whatsapp"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 pl-6 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 mb-1 block">Email</label>
                    <Mail className="absolute left-0 bottom-2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 pl-6 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="text-sm text-gray-600 mb-1 block">Address</label>
                    <MapPin className="absolute left-0 bottom-2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Address"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 pl-6 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">City</label>
                    <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                      <SelectTrigger className="border-0 border-b border-gray-300 rounded-none">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {INDIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">State</label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="border-0 border-b border-gray-300 rounded-none">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Teaching Details */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Teaching Details</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Primary Subject</label>
                    <input
                      type="text"
                      value={formData.primarySubject}
                      onChange={(e) => handleInputChange('primarySubject', e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Secondary Subjects</label>
                    <input
                      type="text"
                      value={formData.secondarySubjects}
                      onChange={(e) => handleInputChange('secondarySubjects', e.target.value)}
                      placeholder="e.g., Physics, Chemistry"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Experience (Years)</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 5"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="e.g., B.Ed, M.Sc"
                      className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 focus:outline-none focus:border-[#6C5DD3] text-gray-900 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Teaching Mode</label>
                    <Select value={formData.teachingMode} onValueChange={(value) => handleInputChange('teachingMode', value)}>
                      <SelectTrigger className="border-0 border-b border-gray-300 rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">About Me</h3>
                <textarea
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Tell about yourself, your teaching philosophy, and experience..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#6C5DD3] text-gray-900 resize-none"
                />
              </div>

              {/* Skills */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Skills</h3>
                  <button 
                    onClick={addNewSkill}
                    className="flex items-center gap-2 text-[#6C5DD3] text-sm font-semibold hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Skill
                  </button>
                </div>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          className="text-gray-700 font-medium bg-transparent border-0 focus:outline-none focus:border-b focus:border-[#6C5DD3]"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 font-semibold">{skill.level}%</span>
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6C5DD3]"
                        style={{
                          background: `linear-gradient(to right, #6C5DD3 0%, #6C5DD3 ${skill.level}%, #E5E7EB ${skill.level}%, #E5E7EB 100%)`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-xl px-8"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="rounded-xl px-8 bg-[#6C5DD3] hover:bg-[#5B4CC2]"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-md sticky top-24">
              {/* Profile Avatar with Progress */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r={radius} stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      stroke="#6C5DD3"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{user?.fullName || 'Admin'}</h3>
                <p className="text-sm text-gray-500">Programmer</p>
                <div className="flex gap-6 mt-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-gray-800">228</p>
                    <p className="text-gray-500">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800">4,842</p>
                    <p className="text-gray-500">Followers</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">+50 123 456 78</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user?.email || 'admin@email.com'}</span>
                  </div>
                </div>
              </div>

              {/* Skills Circle Indicators */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-around">
                  {[
                    { name: 'PHP', level: 66, color: '#FF9F43' },
                    { name: 'Vue', level: 31, color: '#2ECC71' },
                    { name: 'Laravel', level: 7, color: '#4ECDC4' },
                  ].map((skill, index) => {
                    const r = 30;
                    const circ = 2 * Math.PI * r;
                    const offset = circ - (skill.level / 100) * circ;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="relative w-20 h-20">
                          <svg className="transform -rotate-90 w-20 h-20">
                            <circle cx="40" cy="40" r={r} stroke="#E5E7EB" strokeWidth="6" fill="none" />
                            <circle
                              cx="40"
                              cy="40"
                              r={r}
                              stroke={skill.color}
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={circ}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700">{skill.level}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{skill.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Portfolios */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Portfolios</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                    <span className="text-gray-600">facebook.com/admin</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-[#EA4C89]" />
                    <span className="text-gray-600">dribbble.com/admin</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-gray-600">linkedin.com/admin</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Youtube className="w-4 h-4 text-[#FF0000]" />
                    <span className="text-gray-600">youtube.com/admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherProfileEdit;
