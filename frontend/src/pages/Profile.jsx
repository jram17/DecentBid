import React from 'react';
import UserAuctions from '@/components/UserProfile/UserAuctions';
import UserPrevHistory from '@/components/UserProfile/UserPrevHistory';
const Profile = () => {
  return (
    
    <div className="flex flex-col  gap-2 p-4 w-full ">
      <h1 className='text-3xl font-bold p-4 text-gray-800 text-center'>Profile</h1>
      <div className='flex flex-row'>
        <div className='min-w-80 '>
          <ProfileChoices choice={'Owning Auctions'} onClick={()=>console.log("ji")}/>
          <ProfileChoices choice={'Participating '} onClick={()=>console.log("ji")}/>
          
        </div>
        <UserAuctions />
      {/* <UserPrevHistory /> */}
        </div>
      
    </div>
  );
};

export default Profile;


export function ProfileChoices({choice,onClick}){
  return (
    <div onClick={()=>onClick()} className='bg-zinc-300 cursor-pointer
     border hover:scale-105 hover:bg-neutral-200 hover:border-gray-400 rounded-md hover:shadow-lg text-lg font-normal text-gray-700 p-3'>
      {choice}
    </div>
  )
}