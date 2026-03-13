import React, { useState, useEffect } from "react";
import { User, Camera, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import ParentLayout from "./ParentLayout";

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana'
].sort();

const ProfileSettings = () => {
  const { user, refetchUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    address: '',
    city: '',
    state: '',
    childGrade: '',
    preferredSubjects: []
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        contact: user.contact || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        childGrade: user.childGrade || '',
        preferredSubjects: user.preferredSubjects || []
      });
      setProfileImage(user.profilePic || null);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      preferredSubjects: prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter(s => s !== subject)
        : [...prev.preferredSubjects, subject]
    }));
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

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.fullName || !formData.email) {
        toast.error('Full name and email are required!');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone number
      if (formData.contact && !/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      setIsSaving(true);

      // Prepare data for API
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        childGrade: formData.childGrade,
        preferredSubjects: formData.preferredSubjects
      };

      // Call API to update profile
      const response = await axiosInstance.put('/user/profile-update', updateData);

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        await refetchUser();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const availableSubjects = ["Physics", "Mathematics", "Chemistry", "Biology", "English", "Computer Science", "History", "Geography"];

  return (
    <ParentLayout>
      <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#111827] mb-2">Personal Information</h2>
                <p className="text-[#6B7280]">Update your profile information and preferences</p>
              </div>

              <div className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.06)] p-6">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-[#5B3DF5]" />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-[#5B3DF5] rounded-full flex items-center justify-center text-white hover:bg-[#4B2BBF] transition-colors cursor-pointer">
                      {isUploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#111827]">{formData.fullName || "Parent"}</h3>
                    <p className="text-[#6B7280]">Parent Account</p>
                    <label htmlFor="profile-upload" className="mt-2 text-[#5B3DF5] text-sm font-medium hover:underline cursor-pointer inline-block">
                      Change Profile Picture
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                      placeholder="9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                    >
                      <option value="">Select city</option>
                      {INDIAN_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111827] mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#111827] mb-2">Child's Grade/Class</label>
                    <select
                      value={formData.childGrade}
                      onChange={(e) => handleInputChange('childGrade', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
                    >
                      <option value="">Select grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#111827] mb-2">Preferred Subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSubjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            formData.preferredSubjects.includes(subject)
                              ? 'bg-[#5B3DF5] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
    </ParentLayout>
  );
};

export default ProfileSettings;
