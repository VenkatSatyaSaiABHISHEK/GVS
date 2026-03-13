import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { toast } from 'sonner';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Safe destructuring with defaults
  const profileCompletion = useProfileCompletion();
  const {
    profile = null,
    requiredFields = [],
    profileCompleted = false,
    completeProfile,
    isCompletingProfile = false,
    uploadProfilePicture,
    isUploadingPicture = false,
    fieldsLoading = false,
    refetchProfile
  } = profileCompletion || {};

  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form with existing data - with safe checks
  useEffect(() => {
    if (profile && Array.isArray(requiredFields) && requiredFields.length > 0) {
      const initialData = {};
      requiredFields.forEach(field => {
        if (field && field.name) {
          initialData[field.name] = profile[field.name] || '';
        }
      });
      setFormData(initialData);
      if (profile.profilePic) {
        setProfileImage(profile.profilePic);
      }
    }
  }, [profile, requiredFields]);

  // Map backend roles to frontend route paths
  const roleToRoute = {
    jobSeeker: "teacher",
    recruiter: "school",
    teacher: "teacher",
    school: "school",
    parent: "parent",
    admin: "admin",
  };

  // Redirect if profile already completed
  useEffect(() => {
    if (profileCompleted) {
      const route = roleToRoute[user?.role] || user?.role;
      navigate(`/dashboard/${route}`, { replace: true });
    }
  }, [profileCompleted, navigate, user?.role]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!Array.isArray(requiredFields)) return true;
    
    requiredFields.forEach(field => {
      if (field && field.required && field.name) {
        const value = formData[field.name];
        
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
        
        // Validate email
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[field.name] = 'Please enter a valid email';
          }
        }
        
        // Validate phone
        if (field.type === 'tel' && value) {
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(String(value).replace(/\D/g, ''))) {
            newErrors[field.name] = 'Please enter a valid 10-digit phone number';
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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
      await uploadProfilePicture(file);
      await refetchProfile();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await completeProfile(formData);
      // Redirect will happen via useEffect when profileCompleted changes
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  if (fieldsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 stroke-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile form...</p>
        </div>
      </div>
    );
  }

  // Ensure requiredFields is a valid array before rendering the form
  const safeRequiredFields = Array.isArray(requiredFields) ? requiredFields : [];
  const renderableFields = safeRequiredFields.filter(
    (field) => field && field.name && field.name !== 'profilePic'
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to complete your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Please fill in all required fields to get started</p>
        </div>

        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You need to complete your profile to access the dashboard. All fields marked with * are required.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Profile Picture Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-center">
                    <Upload className="w-8 h-8 mx-auto" />
                  </div>
                )}
              </div>
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingPicture}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={(e) => e.currentTarget.parentElement.querySelector('input').click()}
                  disabled={isUploadingPicture}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploadingPicture ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </>
                  )}
                </button>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {renderableFields.map(field => (
              field && field.name ? (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label || field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={`Enter ${(field.label || field.name).toLowerCase()}`}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select {field.label || field.name}</option>
                    {(Array.isArray(field.options) ? field.options : []).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'array' ? (
                  Array.isArray(field.options) && field.options.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {field.options.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            const current = formData[field.name] || [];
                            const updated = current.includes(option)
                              ? current.filter(s => s !== option)
                              : [...current, option];
                            handleInputChange(field.name, updated);
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            (formData[field.name] || []).includes(option)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : ''}
                      onChange={(e) => {
                        const values = e.target.value
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean);
                        handleInputChange(field.name, values);
                      }}
                      placeholder={`Enter ${(field.label || field.name).toLowerCase()} (comma separated)`}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors[field.name] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )
                ) : field.type === 'boolean' ? (
                  <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={Boolean(formData[field.name])}
                      onChange={(e) => handleInputChange(field.name, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      {field.label || field.name}
                    </span>
                  </label>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={`Enter ${(field.label || field.name).toLowerCase()}`}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors[field.name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
              ) : null
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCompletingProfile}
            className="w-full mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCompletingProfile ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Completing Profile...
              </>
            ) : (
              'Complete Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
