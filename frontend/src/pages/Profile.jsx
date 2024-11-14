import React from 'react';
import UserAuctions from '@/components/UserProfile/UserAuctions';
import UserPrevHistory from '@/components/UserProfile/UserPrevHistory';
const Profile = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1>Profile</h1>
      <UserAuctions />
      <UserPrevHistory />
    </div>
  );
};

export default Profile;
