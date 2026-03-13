import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import SchoolLayout from "@/components/Dashboard/SchoolDashboard/SchoolLayout";
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
  "Nashik","Noida","Patna","Pune","Rajkot","Surat","Thane","Vadodara",
  "Varanasi","Visakhapatnam",
];

const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology","English","Hindi",
  "Computer Science","Social Studies","History","Geography","Economics",
  "Political Science","Physical Education","Art & Craft","Music",
];

const FACILITIES = [
  "Smart Classrooms","Computer Lab","Science Lab","Library","Sports Ground",
  "Auditorium","Swimming Pool","Transport","Hostel","Cafeteria",
  "Medical Room","Wi-Fi Campus",
];

const SchoolProfilePageNew = () => {
  const { user, refetchUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "",
    boardAffiliation: "",
    yearEstablished: "",
    institutionSize: "",
    hrContactPerson: "",
    contactPhone: "",
    whatsapp: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    about: "",
    facilities: [],
    subjectsHiring: [],
    requiredQualifications: "",
    minimumExperience: "",
    currentlyHiring: true,
    profilePic: "",
  });

  /* ─── Load user data ─── */
  useEffect(() => {
    if (!user) return;
    setFormData({
      institutionName: user.fullName || "",
      institutionType: user.institutionType || "",
      boardAffiliation: user.boardAffiliation || "",
      yearEstablished: user.yearEstablished || "",
      institutionSize: user.institutionSize || "",
      hrContactPerson: user.hrContactPerson || "",
      contactPhone: user.contact || "",
      whatsapp: user.whatsapp || user.contact || "",
      email: user.email || "",
      website: user.profileLinks?.website || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      about: user.bio || "",
      facilities: user.facilities || [],
      subjectsHiring: user.subjectsHiring || [],
      requiredQualifications: user.requiredQualifications || "",
      minimumExperience: user.minimumExperience || "",
      currentlyHiring: user.currentlyHiring !== undefined ? user.currentlyHiring : true,
      profilePic: user.profilePic || "",
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
        setFormData((prev) => ({ ...prev, profilePic: res.data.profilePic }));
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
    if (!formData.institutionName || !formData.email) {
      return toast.error("Institution name and email are required!");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return toast.error("Invalid email");
    if (formData.contactPhone && !/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, "")))
      return toast.error("Enter a valid 10-digit phone number");

    try {
      setIsSaving(true);
      const updateData = {
        fullName: formData.institutionName,
        email: formData.email,
        contact: formData.contactPhone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        bio: formData.about,
        profileLinks: {
          website: formData.website,
          linkedIn: user?.profileLinks?.linkedIn || "",
          github: user?.profileLinks?.github || "",
          youtube: user?.profileLinks?.youtube || "",
          portfolio: user?.profileLinks?.portfolio || "",
        },
        institutionType: formData.institutionType,
        boardAffiliation: formData.boardAffiliation,
        yearEstablished: formData.yearEstablished,
        institutionSize: formData.institutionSize,
        hrContactPerson: formData.hrContactPerson,
        whatsapp: formData.whatsapp,
        facilities: formData.facilities,
        subjectsHiring: formData.subjectsHiring,
        requiredQualifications: formData.requiredQualifications,
        minimumExperience: formData.minimumExperience,
        currentlyHiring: formData.currentlyHiring,
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
      institutionName: user.fullName || "",
      institutionType: user.institutionType || "",
      boardAffiliation: user.boardAffiliation || "",
      yearEstablished: user.yearEstablished || "",
      institutionSize: user.institutionSize || "",
      hrContactPerson: user.hrContactPerson || "",
      contactPhone: user.contact || "",
      whatsapp: user.whatsapp || user.contact || "",
      email: user.email || "",
      website: user.profileLinks?.website || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      about: user.bio || "",
      facilities: user.facilities || [],
      subjectsHiring: user.subjectsHiring || [],
      requiredQualifications: user.requiredQualifications || "",
      minimumExperience: user.minimumExperience || "",
      currentlyHiring: user.currentlyHiring !== undefined ? user.currentlyHiring : true,
      profilePic: user.profilePic || "",
    });
    toast.info("Changes cancelled");
  };

  /* ─── Field definitions ─── */
  const fieldSections = [
    {
      section: "Institution Info",
      rows: [
        [
          { key: "institutionName", label: "Institution Name", placeholder: "Enter institution name" },
          {
            key: "institutionType",
            label: "Institution Type",
            type: "select",
            options: [
              "CBSE School",
              "ICSE School",
              "State Board School",
              "International School",
              "Play School",
              "Coaching Institute",
              "College",
              "University",
            ],
            placeholder: "Select type",
          },
          {
            key: "boardAffiliation",
            label: "Board Affiliation",
            type: "select",
            options: ["CBSE","ICSE","State Board","IB","Cambridge","IGCSE"],
            placeholder: "Select board",
          },
        ],
        [
          { key: "yearEstablished", label: "Year Established", placeholder: "e.g., 1990" },
          {
            key: "institutionSize",
            label: "Institution Size",
            type: "select",
            options: ["Small (< 500)","Medium (500-2000)","Large (2000-5000)","Very Large (5000+)"],
            placeholder: "Select size",
          },
          { key: "hrContactPerson", label: "HR / Contact Person", placeholder: "Contact person name" },
        ],
      ],
    },
    {
      section: "Contact",
      rows: [
        [
          { key: "contactPhone", label: "Phone", type: "phone" },
          { key: "whatsapp", label: "WhatsApp", type: "whatsapp" },
          { key: "email", label: "Email", type: "email" },
        ],
        [
          { key: "website", label: "Website", placeholder: "https://example.com" },
          { key: "address", label: "Address", type: "address" },
          {
            key: "city",
            label: "City",
            type: "select",
            options: INDIAN_CITIES,
            placeholder: "Select city",
          },
        ],
        [
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
      section: "Hiring",
      rows: [
        [
          { key: "requiredQualifications", label: "Required Qualifications", placeholder: "e.g., B.Ed, M.Sc" },
          { key: "minimumExperience", label: "Minimum Experience", placeholder: "e.g., 2 years" },
        ],
        [
          {
            key: "subjectsHiring",
            label: "Subjects Hiring For",
            type: "tags",
            options: SUBJECTS,
          },
        ],
      ],
    },
    {
      section: "Facilities",
      rows: [
        [
          {
            key: "facilities",
            label: "Facilities Available",
            type: "tags",
            options: FACILITIES,
          },
        ],
      ],
    },
    {
      section: "About",
      rows: [
        [
          {
            key: "about",
            label: "About Institution",
            type: "textarea",
            placeholder: "Describe your institution, culture, achievements…",
            fullWidth: true,
          },
        ],
      ],
    },
  ];

  /* ─── Derived data for card ─── */
  const cardStats = [
    { label: "Jobs Posted", value: user?.jobsPosted || 0 },
    { label: "Teachers Hired", value: user?.teachersHired || 0 },
    { label: "Applications", value: user?.applicationsReceived || 0 },
  ];

  return (
    <SchoolLayout>
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
            toggleLabel="Currently Hiring"
            toggleKey="currentlyHiring"
          />
        }
        right={
          <ProfileCard
            user={user}
            profileData={formData}
            stats={cardStats}
            skills={[]}
            roleTitle={formData.institutionType || "Educational Institution"}
            portfolioLinks={
              formData.website
                ? [{ platform: "website", url: formData.website }]
                : []
            }
            onImageUpload={handleImageUpload}
            isUploadingImage={isUploadingImage}
          />
        }
      />
    </SchoolLayout>
  );
};

export default SchoolProfilePageNew;
