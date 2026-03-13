import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  Linkedin,
  Globe,
  Youtube,
  ExternalLink,
  MoreHorizontal,
  Camera,
  Loader2,
} from "lucide-react";

/**
 * Reusable ProfileCard – RIGHT panel (matches Jobie reference).
 */
const ProfileCard = ({
  user,
  profileData,
  stats = [],
  skills = [],
  roleTitle = "User",
  portfolioLinks = [],
  onImageUpload,
  isUploadingImage = false,
}) => {
  const fileInputRef = useRef(null);

  const fullName =
    [profileData?.firstName, profileData?.middleName, profileData?.lastName]
      .filter(Boolean)
      .join(" ") ||
    profileData?.institutionName ||
    profileData?.fullName ||
    user?.fullName ||
    "User Name";

  const phone =
    profileData?.mobile ||
    profileData?.contactPhone ||
    profileData?.contact ||
    user?.contact ||
    "";
  const email = profileData?.email || user?.email || "";
  const avatarSrc = profileData?.profilePic || user?.profilePic;

  /* compute profile completeness */
  const completeness = (() => {
    const checks = [fullName, phone, email, avatarSrc, profileData?.bio || profileData?.about];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  })();

  const ringColors = ["#6C5CE7", "#10B981", "#06B6D4", "#FF9800", "#EF4444"];

  const platformStyles = {
    linkedin: { bg: "bg-[#0077B5]", label: "LinkedIn" },
    portfolio: { bg: "bg-[#E91E63]", label: "Portfolio" },
    youtube: { bg: "bg-[#FF0000]", label: "YouTube" },
    website: { bg: "bg-[#6C5CE7]", label: "Website" },
    github: { bg: "bg-gray-800", label: "GitHub" },
    instagram: { bg: "bg-gradient-to-br from-pink-500 to-orange-400", label: "Instagram" },
  };

  const handleFileClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) onImageUpload(file);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-6 space-y-6">
      {/* ── Avatar with progress ring ── */}
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="#E5E7EB" strokeWidth="5" fill="none" />
            <circle cx="60" cy="60" r="54" stroke="#6C5CE7" strokeWidth="5" fill="none" strokeDasharray={`${completeness * 3.39} ${100 * 3.39}`} strokeLinecap="round" />
          </svg>
          {/* avatar */}
          <div className="absolute inset-[8px] rounded-full overflow-hidden">
            <Avatar className="w-full h-full">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className="bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] text-white text-3xl font-bold">{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          {/* percentage badge */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#6C5CE7] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">{completeness}%</div>
          {/* camera button */}
          {onImageUpload && (
            <button type="button" onClick={handleFileClick} disabled={isUploadingImage} className="absolute top-0 right-0 w-8 h-8 bg-[#6C5CE7] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#5A4FCF] transition-colors">
              {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{fullName}</h3>
        <p className="text-gray-500 text-sm mt-0.5">{roleTitle}</p>
      </div>

      {/* ── Stats row ── */}
      {stats.length > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center py-4 border-y border-gray-100">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-[11px] text-gray-500 leading-tight uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Contact info ── */}
      <div className="space-y-3">
        {phone && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-9 h-9 bg-[#6C5CE7]/10 rounded-xl flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-[#6C5CE7]" /></div>
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-9 h-9 bg-[#6C5CE7]/10 rounded-xl flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-[#6C5CE7]" /></div>
            <span className="truncate">{email}</span>
          </div>
        )}
      </div>

      {/* ── Skill donuts ── */}
      {skills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Skills Overview</h4>
          <div className="flex justify-center gap-5 flex-wrap">
            {skills.slice(0, 4).map((sk, i) => (
              <div key={i} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-1">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke={ringColors[i % ringColors.length]} strokeWidth="8" fill="none" strokeDasharray={`${sk.percentage * 2.51} ${100 * 2.51}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">{sk.percentage}%</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-tight">{sk.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Portfolio links ── */}
      {portfolioLinks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">Portfolios</h4>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <div className="space-y-2">
            {portfolioLinks.map((link, i) => {
              const style = platformStyles[link.platform] || { bg: "bg-gray-500", label: link.platform };
              return (
                <a key={i} href={link.url || "#"} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white ${style.bg} hover:opacity-90 transition-opacity`}>
                  {link.platform === "linkedin" && <Linkedin className="w-4 h-4" />}
                  {link.platform === "youtube" && <Youtube className="w-4 h-4" />}
                  {!["linkedin", "youtube"].includes(link.platform) && <Globe className="w-4 h-4" />}
                  <span className="text-sm font-medium flex-1 truncate">{link.displayText || style.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
