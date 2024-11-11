import React, { useState } from 'react';
import { toTitleCase } from '@/utils/AuctionDetailsUtils';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
function JoinRoomModal({ auction }) {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const enableRevealPhase = async (id) => {
    if (isLoading) return;
    try {
      setLoading(true);
      const response = await axios.put(`/auctions/enable-reveal/${id}`);
      if (response.status === 200) {
        setError(false);
        setErrorMsg('');
        setLoading(false);
        toast({
          title: 'Reveal phase enabled successfully',
        });
      } else {
        setError(true);
        setErrorMsg('Failed to enable reveal phase.');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMsg('Failed to enable reveal phase.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
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
          <Button
            onClick={() => {
              return enableRevealPhase(auction.auctionid);
            }}
          >
            Start Reveal Phase
          </Button>
          <Button>Announce Winner</Button>
          <Button>Transfer Amount</Button>
        </div>
        {isError && <p className=" form-message">{error}</p>}
      </div>
    </div>
  );
}

export default JoinRoomModal;
