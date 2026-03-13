/**
 * Shared two-column grid used by every profile page.
 * Left = form, Right = summary card.
 * Background matches the reference (light gray).
 */
const ProfilePageLayout = ({ left, right }) => {
  return (
    <div className="min-h-screen bg-[#F5F6FA] p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left – Edit form (grows) */}
          <div className="flex-1 min-w-0">{left}</div>
          {/* Right – Summary card (fixed width) */}
          <div className="w-full lg:w-80 flex-shrink-0">{right}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageLayout;
