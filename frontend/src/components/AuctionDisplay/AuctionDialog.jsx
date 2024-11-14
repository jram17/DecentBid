import React, { useState, useEffect } from 'react';
import { toTitleCase } from '@/utils/AuctionDetailsUtils';
import { Button } from '../ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { transferAmount, RevealWinner } from '../../contracthooks/Auction';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import ContractJson from '../../../contract.json';
function JoinRoomModal({ auction }) {
  const address = useSelector((state) => state.address.address);

  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const [isTransferAmount, setTransferAmount] = useState(false);
  const [isRevealWinner, setRevealWinner] = useState(false);
  const [isRevealEnabled, setRevealEnabled] = useState(false);
  useEffect(() => {
    const fetchAuctionStatus = async () => {
      try {
        if (!address || !auction.auctionid) return;

        if (auction.isWinnedAnnounced != 'Yet to be Decided') {
          setRevealWinner(true);
        }

        if (auction.isRevealEnabled) setRevealEnabled(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        await provider.send('eth_requestAccounts', []);
        const auctionContract = new ethers.Contract(
          ContractJson.contractAddress,
          ContractJson.abi,
          signer
        );

        const filter = auctionContract.filters.TransferStatus(
          null,
          auction.auctionid
        );
        const events = await auctionContract.queryFilter(filter, 0, 'latest');
        if (events.length > 0) {
          setTransferAmount(true);
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorMsg('Failed to fetch auction status.');
      }
    };
    fetchAuctionStatus();
  }, [address, auction]);
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
        setRevealEnabled(true);
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

  const RevealWinnerFn = async (id) => {
    if (isLoading) return;

    try {
      setLoading(true);
      const response = await RevealWinner(id);
      if (response.success) {
        setRevealWinner(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMsg('Failed to reveal winner.');
    } finally {
      setLoading(false);
    }
  };

  const TransferAmountFn = async (id) => {
    try {
      if (isLoading) return;
      setLoading(true);
      const response = await transferAmount(id);
      if (response.success) {
        setTransferAmount(true);
      } else {
        setError(true);
        setErrorMsg('Failed to transfer amount.');
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMsg('Failed to transfer amount.');
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
              {isRevealEnabled
                ? 'Reveal Phase'
                : isRevealWinner
                ? 'Winner Announced'
                : 'Commit Phase'}
            </span>
          </div>
        </div>
        <div className="card-content grid gap-x-3 grid-cols-3 w-full">
          <Button
            onClick={() => {
              if (isRevealEnabled) return;
              return enableRevealPhase(auction.auctionid);
            }}
          >
            Start Reveal Phase
          </Button>
          <Button
            onClick={() => {
              if (isRevealWinner) return;
              return RevealWinnerFn(auction.auctionid);
            }}
          >
            Announce Winner
          </Button>
          <Button
            onClick={() => {
              if (isTransferAmount) return;
              return TransferAmountFn(auction.auctionid);
            }}
          >
            Transfer Amount
          </Button>
        </div>
        {isError && <p className=" form-message">{error}</p>}
      </div>
    </div>
  );
}

export default JoinRoomModal;
