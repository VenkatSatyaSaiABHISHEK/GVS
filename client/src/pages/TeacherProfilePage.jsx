import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import TeacherLayout from "@/components/Dashboard/TeacherDashboard/TeacherLayout";
import ProfilePageLayout from "@/components/Dashboard/Profile/Shared/ProfilePageLayout";
import ProfileForm from "@/components/Dashboard/Profile/Shared/ProfileForm";
import ProfileCard from "@/components/Dashboard/Profile/Shared/ProfileCard";

/* ─── Location data ─── */
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];
const INDIAN_CITIES = [
  "Agra","Ahmedabad","Ajmer","Aligarh","Allahabad","Amravati","Amritsar",
  "Aurangabad","Bangalore","Bareilly","Belgaum","Bhavnagar","Bhilai","Bhopal",
  "Bhubaneswar","Bikaner","Chandigarh","Chennai","Coimbatore","Cuttack",
  "Dehradun","Delhi","Dhanbad","Durgapur","Erode","Faridabad","Firozabad",
  "Gaya","Ghaziabad","Gorakhpur","Gulbarga","Guntur","Guwahati","Gwalior",
  "Howrah","Hubli-Dharwad","Hyderabad","Indore","Jabalpur","Jaipur","Jalandhar",
  "Jalgaon","Jammu","Jamnagar","Jamshedpur","Jhansi","Jodhpur","Kanpur",
  "Kochi","Kota","Kolhapur","Kolkata","Lucknow","Ludhiana","Madurai",
  "Malegaon","Mangalore","Meerut","Moradabad","Mumbai","Mysore","Nagpur",
  "Nanded","Nashik","Navi Mumbai","Nellore","Noida","Patna","Pimpri-Chinchwad",
  "Pune","Raipur","Rajkot","Ranchi","Rourkela","Saharanpur","Salem","Sangli-Miraj",
  "Siliguri","Solapur","Srinagar","Surat","Thane","Tiruchirappalli","Tirunelveli",
  "Tiruppur","Udaipur","Ujjain","Vadodara","Varanasi","Vasai-Virar",
  "Vijayawada","Visakhapatnam","Warangal",
];

const TeacherProfilePage = () => {
  const { user, refetchUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    password: "",
    retypePassword: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    state: "",
    primarySubject: "",
    secondarySubjects: "",
    experience: "",
    qualification: "",
    teachingMode: "Hybrid",
    hourlyRate: "",
    about: "",
    availableForHire: true,
    skills: [
      { name: "Subject Knowledge", level: 90 },
      { name: "Communication", level: 85 },
      { name: "Online Teaching", level: 80 },
      { name: "Classroom Management", level: 88 },
    ],
  });

  const [portfolioLinks, setPortfolioLinks] = useState({
    linkedin: "",
    youtube: "",
    website: "",
    portfolio: "",
  });

  /* ─── Load user data ─── */
  useEffect(() => {
    if (!user) return;
    const nameParts = user.fullName?.split(" ") || [];
    setFormData({
      firstName: nameParts[0] || "",
      middleName: nameParts[1] || "",
      lastName: nameParts.slice(2).join(" ") || "",
      username: user.email?.split("@")[0] || "",
      password: "",
      retypePassword: "",
      mobile: user.contact || "",
      whatsapp: user.contact || "",
      email: user.email || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      primarySubject: user.primarySubject || "",
      secondarySubjects: Array.isArray(user.secondarySubjects)
        ? user.secondarySubjects.join(", ")
        : user.secondarySubjects || "",
      experience: user.yoe || "",
      qualification: user.qualification || "",
      teachingMode: user.teachingMode || "Hybrid",
      hourlyRate: user.hourlyRate || "",
      about: user.bio || "",
      availableForHire: user.availableForHire !== false,
      skills:
        user.skills?.length > 0
          ? user.skills.map((s) => ({
              name: typeof s === "string" ? s : s.name,
              level: s.level || 50,
            }))
          : [
              { name: "Subject Knowledge", level: 90 },
              { name: "Communication", level: 85 },
              { name: "Online Teaching", level: 80 },
              { name: "Classroom Management", level: 88 },
            ],
    });
    setPortfolioLinks({
      linkedin: user.profileLinks?.linkedIn || "",
      youtube: user.profileLinks?.youtube || "",
      website: user.profileLinks?.website || "",
      portfolio: user.profileLinks?.portfolio || "",
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
    if (formData.password && formData.password !== formData.retypePassword) {
      return toast.error("Passwords do not match!");
    }
    if (!formData.firstName || !formData.email) {
      return toast.error("First name and email are required!");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return toast.error("Invalid email");
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\D/g, "")))
      return toast.error("Enter a valid 10-digit phone number");

    try {
      setIsSaving(true);
      const updateData = {
        fullName: [formData.firstName, formData.middleName, formData.lastName]
          .filter(Boolean)
          .join(" "),
        contact: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        bio: formData.about,
        yoe: formData.experience,
        primarySubject: formData.primarySubject,
        secondarySubjects: typeof formData.secondarySubjects === "string"
          ? formData.secondarySubjects.split(",").map((s) => s.trim()).filter(Boolean)
          : formData.secondarySubjects || [],
        qualification: formData.qualification,
        teachingMode: formData.teachingMode,
        hourlyRate: formData.hourlyRate,
        skills: formData.skills,
        availableForHire: formData.availableForHire,
        profileLinks: {
          linkedIn: portfolioLinks.linkedin,
          youtube: portfolioLinks.youtube,
          website: portfolioLinks.website,
          portfolio: portfolioLinks.portfolio,
        },
      };
      if (formData.password) updateData.password = formData.password;

      const res = await axiosInstance.put("/user/profile-update", updateData);
      if (res.data.success) {
        toast.success("Profile updated!");
        await refetchUser();
        setFormData((p) => ({ ...p, password: "", retypePassword: "" }));
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    const nameParts = user.fullName?.split(" ") || [];
    setFormData({
      firstName: nameParts[0] || "",
      middleName: nameParts[1] || "",
      lastName: nameParts.slice(2).join(" ") || "",
      username: user.email?.split("@")[0] || "",
      password: "",
      retypePassword: "",
      mobile: user.contact || "",
      whatsapp: user.contact || "",
      email: user.email || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      primarySubject: user.primarySubject || "",
      secondarySubjects: Array.isArray(user.secondarySubjects)
        ? user.secondarySubjects.join(", ")
        : user.secondarySubjects || "",
      experience: user.yoe || "",
      qualification: user.qualification || "",
      teachingMode: user.teachingMode || "Hybrid",
      hourlyRate: user.hourlyRate || "",
      about: user.bio || "",
      availableForHire: user.availableForHire !== false,
      skills:
        user.skills?.length > 0
          ? user.skills.map((s) => ({
              name: typeof s === "string" ? s : s.name,
              level: s.level || 50,
            }))
          : [
              { name: "Subject Knowledge", level: 90 },
              { name: "Communication", level: 85 },
              { name: "Online Teaching", level: 80 },
              { name: "Classroom Management", level: 88 },
            ],
    });
    setPortfolioLinks({
      linkedin: user.profileLinks?.linkedIn || "",
      youtube: user.profileLinks?.youtube || "",
      website: user.profileLinks?.website || "",
      portfolio: user.profileLinks?.portfolio || "",
    });
    toast.info("Changes cancelled");
  };

  /* ─── Field definitions ─── */
  const fieldSections = [
    {
      section: "Generals",
      rows: [
        [
          { key: "firstName", label: "First Name", placeholder: "Enter first name" },
          { key: "middleName", label: "Middle Name", placeholder: "Enter middle name" },
          { key: "lastName", label: "Last Name", placeholder: "Enter last name" },
        ],
        [
          { key: "username", label: "Username", placeholder: "Username", disabled: true },
          { key: "password", label: "Password", type: "password" },
          { key: "retypePassword", label: "Re-Type Password", type: "password" },
        ],
      ],
    },
    {
      section: "Contact",
      rows: [
        [
          { key: "mobile", label: "Mobile Phone", type: "phone" },
          { key: "whatsapp", label: "WhatsApp", type: "whatsapp" },
          { key: "email", label: "Email", type: "email" },
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
      section: "Teaching Details",
      rows: [
        [
          { key: "primarySubject", label: "Primary Subject", placeholder: "e.g., Mathematics" },
          { key: "secondarySubjects", label: "Secondary Subjects", placeholder: "e.g., Physics, Chemistry" },
          { key: "experience", label: "Years of Experience", placeholder: "e.g., 5" },
        ],
        [
          { key: "qualification", label: "Qualification", placeholder: "e.g., B.Ed, M.Sc" },
          {
            key: "teachingMode",
            label: "Teaching Mode",
            type: "select",
            options: ["Online", "Offline", "Hybrid"],
          },
          { key: "hourlyRate", label: "Hourly Rate (₹)", placeholder: "e.g., 500" },
        ],
      ],
    },
    {
      section: "About Me",
      rows: [
        [
          {
            key: "about",
            label: "About Me",
            type: "textarea",
            placeholder: "Tell about your teaching experience, subjects you teach, achievements…",
            fullWidth: true,
          },
        ],
      ],
    },
    {
      section: "Skills",
      rows: [
        [{ key: "skills", label: "Skills", type: "skills" }],
      ],
    },
  ];

  /* ─── Derived data for ProfileCard ─── */
  const cardSkills = (formData.skills || []).slice(0, 4).map((s) => ({
    name: s.name,
    percentage: s.level,
  }));

  const cardStats = [
    { label: "Applications", value: user?.applications?.length || 0 },
    { label: "Interviews", value: user?.interviews || 0 },
    { label: "Profile Views", value: user?.profileViews || 0 },
  ];

  const cardPortfolioLinks = [
    portfolioLinks.linkedin && { platform: "linkedin", url: portfolioLinks.linkedin },
    portfolioLinks.youtube && { platform: "youtube", url: portfolioLinks.youtube },
    portfolioLinks.website && { platform: "website", url: portfolioLinks.website },
    portfolioLinks.portfolio && { platform: "portfolio", url: portfolioLinks.portfolio },
  ].filter(Boolean);

  return (
    <TeacherLayout>
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
            toggleLabel="Available for Hiring"
            toggleKey="availableForHire"
          />
        }
        right={
          <ProfileCard
            user={user}
            profileData={formData}
            stats={cardStats}
            skills={cardSkills}
            roleTitle={formData.primarySubject || "Subject Teacher"}
            portfolioLinks={cardPortfolioLinks}
            onImageUpload={handleImageUpload}
            isUploadingImage={isUploadingImage}
          />
        }
      />
    </TeacherLayout>
  );
};

export default TeacherProfilePage;
