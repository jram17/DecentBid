import React, { useState } from 'react';

import axios from 'axios';
import { toTitleCase } from '@/utils/AuctionDetailsUtils';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

function JoinRoomModal({ auction }) {
  console.log(auction);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const navigate = useNavigate();

  return (
    <div className="grid w-full items-center px-4 sm:justify-center border-none shadow-none font-form  justify-center">
      <div className="card w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center h-full justify-center gap-6">
        <div className="card-header flex items-center justify-center gap-2  flex-col">
          <div className="card-title flex items-center justify-center text-nowrap max-sm:text-lg font-title !text-2xl">
            Edit Apartment Details
          </div>
        </div>
        <div className="car-content">
          <div className="flex gap-3">
            {' '}
            <span className="min-w-[10vw]">Auction Id</span>
            <span>{auction.auctionid}</span>
          </div>
          <div className="flex gap-3">
            {' '}
            <span className="min-w-[10vw]">Auction Name</span>
            <span>{toTitleCase(auction.auctionname)}</span>
          </div>
          <div className="flex gap-3">
            {' '}
            <span className="min-w-[10vw]">Auction Status</span>
            <span>
              {auction.isRevealEnabled
                ? 'Reveal Phase'
                : auction.isWinnedAnnounced !== 'Yet to be Decided'
                ? 'Winner Announced'
                : 'Commit Phase'}
            </span>
          </div>
        </div>
        <div className="card-content grid gap-x-3 grid-cols-3 w-full">
          <Button>Start Reveal Phase</Button>
          <Button>Announce Winner</Button>
          <Button>Transfer Amount</Button>
        </div>
      </div>
    </div>
  );
}

export default JoinRoomModal;
