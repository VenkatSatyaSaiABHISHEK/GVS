import React from 'react';

const ProfileStrengthCard = ({ strengthData }) => {
  const strength = strengthData?.strength || 0;
  const missingItems = strengthData?.missingItems || [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume & Profile Strength</h3>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div className="h-3 rounded-full bg-purple-600" style={{ width: `${strength}%` }} />
      </div>
      <p className="text-sm text-gray-700 mb-3">Profile Strength: <span className="font-semibold">{strength}%</span></p>

      {missingItems.length > 0 ? (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Missing:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {missingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-green-700">Great! Your profile looks complete.</p>
      )}
    </div>
  );
};

export default ProfileStrengthCard;
