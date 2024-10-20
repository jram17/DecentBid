import React from 'react';
import { AuctionForm } from '@/components/CreateAuction';
const CreateAuction = () => {
  return (
    <div>
      <div className="max-w-[40vw] p-6 shadow-md">
        <AuctionForm />
      </div>
      <p>Create Auction</p>
    </div>
  );
};

export default CreateAuction;
