import React from 'react';
import { AuctionForm } from '@/components/CreateAuctionForm';
const CreateAuction = () => {
  return (
    <div>
      <p>Create Auction</p>

      <div className="max-w-[40vw] p-6 shadow-md">
        <AuctionForm />
      </div>
    </div>
  );
};

export default CreateAuction;
