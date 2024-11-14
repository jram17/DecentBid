import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Auction from '@/components/AuctionDisplay/Auction';
import CommitReveal from '@/components/AuctionDisplay/CommitReveal';
import { useSelector } from 'react-redux';
import ContractJson from '../../contract.json';
import { ethers } from 'ethers';
function AuctionDetails() {
  const { id } = useParams();
  const [auctionDetails, SetDetails] = useState();
  const [isEventfetching, setEventfetching] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  const [isBasePaid, setisBasePaid] = useState(false);

  const [isCommitPhaseDone, setCommitPhaseDone] = useState(false);
  const [isRevealPhaseDone, setRevealPhaseDone] = useState(false);

  const address = useSelector((state) => state.address.address);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(`/auctions/${id}`);
        SetDetails(response.data);
      } catch (error) {
        setisError(true);
        console.error(error);
      } finally {
        setisLoading(false);
      }
    };
    fetchAuctionDetails();
  }, [id]);
  useEffect(() => {
    try {
      const fetchEvents = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        await provider.send('eth_requestAccounts', []);
        const auctionContract = new ethers.Contract(
          ContractJson.contractAddress,
          ContractJson.abi,
          signer
        );
        const filter1 = auctionContract.filters.BaseAmountPayEvent(address, id);
        const events1 = await auctionContract.queryFilter(filter1, 0, 'latest');
        if (events1.length > 0) {
          setisBasePaid(true);
        }

        const filter3 = auctionContract.filters.commitAmountPayEvent(
          address,
          id
        );
        const events3 = await auctionContract.queryFilter(filter3, 0, 'latest');
        if (events3.length > 0) {
          setCommitPhaseDone(true);
        }
        const filter4 = auctionContract.filters.revealPhaseCompleted(
          address,
          id
        );
        const events4 = await auctionContract.queryFilter(filter4, 0, 'latest');
        if (events4.length > 0) {
          setRevealPhaseDone(true);
        }
      };
      fetchEvents();
    } catch (error) {
      console.error(error);
    } finally {
      setEventfetching(false);
    }
  }, [id, address]);
  if (isLoading || isEventfetching)
    return (
      <div className="w-full min-h-screen flex items-center">Loading...</div>
    );
  if (isError)
    return (
      <div className="w-full h-full flex items-center">
        Error fetching auction details.
      </div>
    );
  return (
    <div className="flex">
      <div className="w-8/12 h-full flex items-center">
        <Auction props={auctionDetails} />
      </div>
      <div className="w-4/12 h-full flex items-center m-8">
        <CommitReveal
          props={{
            auctionDetails,
            id,
            isBasePaid,
            setisBasePaid,
            isCommitPhaseDone,
            isRevealPhaseDone,
            setRevealPhaseDone,
          }}
        />
      </div>
    </div>
  );
}

export default AuctionDetails;
