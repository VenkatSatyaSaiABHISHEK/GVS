import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Plus,
  X,
} from "lucide-react";

/**
 * Reusable ProfileForm – LEFT panel.
 * Matches the Jobie reference: underline inputs, section headers,
 * GENERALS / CONTACT / ABOUT ME / SKILS layout, purple accents.
 */
const ProfileForm = ({
  title = "Edit Profile",
  fields = [],
  profileData = {},
  onInputChange,
  onSave,
  onCancel,
  isSaving = false,
  toggleLabel,
  toggleKey,
  extraHeader,
}) => {
  const [showPassword, setShowPassword] = useState({});
  const togglePw = (k) => setShowPassword((p) => ({ ...p, [k]: !p[k] }));

  /* skill helpers */
  const handleSkillChange = (key, idx, field, val) => {
    const arr = [...(profileData[key] || [])];
    if (field === "remove") arr.splice(idx, 1);
    else arr[idx] = { ...arr[idx], [field]: val };
    onInputChange(key, arr);
  };
  const addSkill = (key) =>
    onInputChange(key, [...(profileData[key] || []), { name: "", level: 50 }]);

  /* tag helpers */
  const handleTagToggle = (key, tag) => {
    const cur = profileData[key] || [];
    onInputChange(key, cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]);
  };

  /* base classes (underline style matching reference) */
  const inputBase =
    "w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6C5CE7] transition-colors";
  const labelBase = "text-[13px] text-gray-500 mb-1 block";

  /* render single field */
  const renderField = (f) => {
    const value = profileData[f.key] ?? "";
    switch (f.type) {
      case "password":
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <div className="relative">
              <input type={showPassword[f.key] ? "text" : "password"} value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || "••••••••••••"} className={`${inputBase} pr-14`} />
              <button type="button" onClick={() => togglePw(f.key)} className="absolute right-0 bottom-2 text-[#6C5CE7] text-xs font-bold tracking-wide hover:underline">{showPassword[f.key] ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
        );
      case "textarea":
        return (
          <div key={f.key} className={f.fullWidth ? "col-span-full" : ""}>
            <label className={labelBase}>{f.label}</label>
            <textarea value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || ""} rows={f.rows || 5} className="w-full min-h-[120px] rounded-xl border border-gray-200 p-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6C5CE7] resize-none bg-transparent" />
          </div>
        );
      case "select":
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <div className="relative">
              <select value={value || ""} onChange={(e) => onInputChange(f.key, e.target.value)} className={`${inputBase} appearance-none cursor-pointer pr-6`}>
                <option value="">{f.placeholder || "Select…"}</option>
                {(f.options || []).map((opt) => { const v = typeof opt === "string" ? opt : opt.value; const l = typeof opt === "string" ? opt : opt.label; return <option key={v} value={v}>{l}</option>; })}
              </select>
              <svg className="absolute right-0 bottom-3 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </div>
          </div>
        );
      case "phone":
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <div className="relative">
              <Phone className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
              <input type="text" value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || "+91 9876543210"} className={`${inputBase} pl-6`} />
            </div>
          </div>
        );
      case "whatsapp":
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <div className="relative">
              <MessageCircle className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
              <input type="text" value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || "+91 9876543210"} className={`${inputBase} pl-6`} />
            </div>
          </div>
        );
      case "email":
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <div className="relative">
              <Mail className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
              <input type="email" value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || "user@email.com"} className={`${inputBase} pl-6`} />
            </div>
          </div>
        );
      case "address":
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <div className="relative">
              <MapPin className="absolute left-0 bottom-3 w-4 h-4 text-gray-400" />
              <input type="text" value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || "Street address"} className={`${inputBase} pl-6`} />
            </div>
          </div>
        );
      case "skills":
        return (
          <div key={f.key} className="col-span-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{f.label}</h3>
              <button type="button" onClick={() => addSkill(f.key)} className="flex items-center gap-1 text-[#6C5CE7] text-sm font-semibold hover:underline"><Plus className="w-4 h-4" />Add New Skills</button>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {(profileData[f.key] || []).map((sk, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <input type="text" value={sk.name || ""} onChange={(e) => handleSkillChange(f.key, idx, "name", e.target.value)} className="text-gray-800 font-medium border-0 px-0 py-0 focus:outline-none bg-transparent w-auto" placeholder="Skill name" />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-semibold text-sm">{sk.level ?? 50}%</span>
                      <button type="button" onClick={() => handleSkillChange(f.key, idx, "remove", null)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" value={sk.level ?? 50} onChange={(e) => handleSkillChange(f.key, idx, "level", parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #6C5CE7 0%, #6C5CE7 ${sk.level ?? 50}%, #E5E7EB ${sk.level ?? 50}%, #E5E7EB 100%)` }} />
                </div>
              ))}
            </div>
          </div>
        );
      case "tags":
        return (
          <div key={f.key} className="col-span-full">
            <label className={labelBase}>{f.label}</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {(f.options || []).map((tag) => {
                const active = (profileData[f.key] || []).includes(tag);
                return <button key={tag} type="button" onClick={() => handleTagToggle(f.key, tag)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? "bg-[#6C5CE7] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{tag}</button>;
              })}
            </div>
          </div>
        );
      default:
        return (
          <div key={f.key}>
            <label className={labelBase}>{f.label}</label>
            <input type="text" value={value} onChange={(e) => onInputChange(f.key, e.target.value)} placeholder={f.placeholder || "Type here"} className={inputBase} disabled={f.disabled} />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      {/* breadcrumb */}
      <div className="text-sm text-[#6C5CE7] font-medium mb-1">
        Profile / <span className="text-gray-400">Edit Profile</span>
      </div>
      {/* header row */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-5">
          {toggleLabel && toggleKey && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm font-medium text-gray-600">{toggleLabel}</span>
              <div className="relative">
                <input type="checkbox" checked={!!profileData[toggleKey]} onChange={(e) => onInputChange(toggleKey, e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-[#6C5CE7] transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          )}
          {extraHeader}
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onSave} disabled={isSaving} className="px-6 py-2 text-sm font-semibold text-white bg-[#6C5CE7] rounded-xl hover:bg-[#5A4FCF] transition-colors disabled:opacity-50">{isSaving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
      {/* field sections */}
      {fields.map((section, si) => (
        <div key={si} className="mb-8 last:mb-0">
          {section.section && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{section.section}</h3>}
          {section.rows.map((row, ri) => (
            <div key={ri} className={`grid gap-6 mb-5 last:mb-0 ${row.length === 1 ? "grid-cols-1" : row.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
              {row.map((field) => renderField(field))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProfileForm;
