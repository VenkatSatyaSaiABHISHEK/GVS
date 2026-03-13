import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import ProfilePageLayout from "@/components/Dashboard/Profile/Shared/ProfilePageLayout";
import ProfileForm from "@/components/Dashboard/Profile/Shared/ProfileForm";
import ProfileCard from "@/components/Dashboard/Profile/Shared/ProfileCard";

/**
 * Admin Profile page — rendered inside AdminLayout via <Outlet />.
 * Uses the same shared components as every other role.
 */
const AdminProfilePage = () => {
  const { admin, checkAuthStatus } = useAdminAuth();
  const user = admin;
  const refetchUser = checkAuthStatus;

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    about: "",
  });

  /* ─── Load user data ─── */
  useEffect(() => {
    if (!user) return;
    setFormData({
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      contact: user.contact || user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      about: user.bio || user.about || "",
    });
  }, [user]);

  /* ─── Handlers ─── */
  const handleInputChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/")) return toast.error("Upload an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5 MB");
    try {
      setIsUploadingImage(true);
      const fd = new FormData();
      fd.append("profilePic", file);
      // Admins may use a different endpoint – try both
      let res;
      try {
        res = await axiosInstance.put("/admin/profile-pic", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        res = await axiosInstance.put("/user/profile-pic", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (res.data.success) {
        toast.success("Profile picture updated!");
        if (refetchUser) await refetchUser();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email)
      return toast.error("Name and email are required!");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return toast.error("Invalid email");

    try {
      setIsSaving(true);
      const updateData = {
        fullName: formData.fullName,
        name: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        phone: formData.contact,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        bio: formData.about,
      };

      let res;
      try {
        res = await axiosInstance.put("/admin/profile", updateData);
      } catch {
        res = await axiosInstance.put("/user/profile-update", updateData);
      }

      if (res.data.success) {
        toast.success("Profile updated!");
        if (refetchUser) await refetchUser();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      contact: user.contact || user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      about: user.bio || user.about || "",
    });
    toast.info("Changes cancelled");
  };

  /* ─── Field definitions ─── */
  const fieldSections = [
    {
      section: "Personal Information",
      rows: [
        [
          { key: "fullName", label: "Full Name", placeholder: "Admin Name" },
          { key: "email", label: "Email", type: "email" },
          { key: "contact", label: "Phone", type: "phone" },
        ],
        [
          { key: "address", label: "Address", type: "address" },
          { key: "city", label: "City", placeholder: "City" },
          { key: "state", label: "State", placeholder: "State" },
        ],
      ],
    },
    {
      section: "About",
      rows: [
        [
          {
            key: "about",
            label: "About",
            type: "textarea",
            placeholder: "Brief description about the admin…",
            fullWidth: true,
          },
        ],
      ],
    },
  ];

  /* ─── Card data ─── */
  const cardStats = [
    { label: "Users", value: user?.totalUsers || 0 },
    { label: "Teachers", value: user?.totalTeachers || 0 },
    { label: "Schools", value: user?.totalSchools || 0 },
  ];

  return (
    <ProfilePageLayout
      left={
        <ProfileForm
          title="Edit Profile"
          fields={fieldSections}
          profileData={formData}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      }
      right={
        <ProfileCard
          user={user}
          profileData={formData}
          stats={cardStats}
          skills={[]}
          roleTitle="Super Admin"
          portfolioLinks={[]}
          onImageUpload={handleImageUpload}
          isUploadingImage={isUploadingImage}
        />
      }
    />
  );
};

export default AdminProfilePage;
