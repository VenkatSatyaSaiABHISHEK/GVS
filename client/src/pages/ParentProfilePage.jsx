import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import ParentLayout from "@/components/Dashboard/ParentDashboard/ParentLayout";
import ProfilePageLayout from "@/components/Dashboard/Profile/Shared/ProfilePageLayout";
import ProfileForm from "@/components/Dashboard/Profile/Shared/ProfileForm";
import ProfileCard from "@/components/Dashboard/Profile/Shared/ProfileCard";

/* ─── Location data ─── */
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
];
const INDIAN_CITIES = [
  "Agra","Ahmedabad","Bangalore","Bhopal","Bhubaneswar","Chandigarh","Chennai",
  "Coimbatore","Dehradun","Delhi","Ghaziabad","Guwahati","Hyderabad","Indore",
  "Jaipur","Kanpur","Kochi","Kolkata","Lucknow","Ludhiana","Mumbai","Nagpur",
  "Nashik","Noida","Patna","Pune","Surat","Thane","Vadodara","Varanasi",
];

const SUBJECTS = [
  "Physics","Mathematics","Chemistry","Biology","English","Hindi",
  "Computer Science","History","Geography","Economics",
  "Political Science","Art & Craft","Music","Sanskrit",
];

const ParentProfilePage = () => {
  const { user, refetchUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    childGrade: "",
    preferredSubjects: [],
  });

  /* ─── Load user data ─── */
  useEffect(() => {
    if (!user) return;
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      contact: user.contact || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      childGrade: user.childGrade || "",
      preferredSubjects: user.preferredSubjects || [],
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
      const res = await axiosInstance.put("/user/profile-pic", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Profile picture updated!");
        await refetchUser();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email)
      return toast.error("Full name and email are required!");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return toast.error("Invalid email");
    if (formData.contact && !/^\d{10}$/.test(formData.contact.replace(/\D/g, "")))
      return toast.error("Enter a valid 10-digit phone number");

    try {
      setIsSaving(true);
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        childGrade: formData.childGrade,
        preferredSubjects: formData.preferredSubjects,
      };
      const res = await axiosInstance.put("/user/profile-update", updateData);
      if (res.data.success) {
        toast.success("Profile updated!");
        await refetchUser();
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
      fullName: user.fullName || "",
      email: user.email || "",
      contact: user.contact || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      childGrade: user.childGrade || "",
      preferredSubjects: user.preferredSubjects || [],
    });
    toast.info("Changes cancelled");
  };

  /* ─── Field definitions ─── */
  const gradeOptions = [...Array(12)].map((_, i) => ({
    value: `Class ${i + 1}`,
    label: `Class ${i + 1}`,
  }));

  const fieldSections = [
    {
      section: "Personal Information",
      rows: [
        [
          { key: "fullName", label: "Full Name", placeholder: "Enter your full name" },
          { key: "email", label: "Email", type: "email" },
          { key: "contact", label: "Phone Number", type: "phone" },
        ],
        [
          { key: "address", label: "Address", type: "address" },
          {
            key: "city",
            label: "City",
            type: "select",
            options: INDIAN_CITIES,
            placeholder: "Select city",
          },
          {
            key: "state",
            label: "State",
            type: "select",
            options: INDIAN_STATES,
            placeholder: "Select state",
          },
        ],
      ],
    },
    {
      section: "Child's Details",
      rows: [
        [
          {
            key: "childGrade",
            label: "Child's Grade / Class",
            type: "select",
            options: gradeOptions,
            placeholder: "Select grade",
          },
        ],
        [
          {
            key: "preferredSubjects",
            label: "Preferred Subjects",
            type: "tags",
            options: SUBJECTS,
          },
        ],
      ],
    },
  ];

  /* ─── Derived card data ─── */
  const cardStats = [
    { label: "Tutors", value: user?.tutorCount || 0 },
    { label: "Sessions", value: user?.sessionCount || 0 },
    { label: "Demos", value: user?.demoCount || 0 },
  ];

  return (
    <ParentLayout>
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
            roleTitle="Parent"
            portfolioLinks={[]}
            onImageUpload={handleImageUpload}
            isUploadingImage={isUploadingImage}
          />
        }
      />
    </ParentLayout>
  );
};

export default ParentProfilePage;
