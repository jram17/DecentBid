import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Auction from '@/components/AuctionDisplay/Auction';
import CommitReveal from '@/components/AuctionDisplay/CommitReveal';
import { useSelector } from 'react-redux';
import ContractJson from '../../contract.json';
function AuctionDetails() {
  const { id } = useParams();
  const [auctionDetails, SetDetails] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  const [isBasePaid, setisBasePaid] = useState(false);
  const address = useSelector((state) => state.address.address);
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
  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);
  useEffect(() => {
    try {
      const fetchEvents = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const auctionContract = new ethers.Contract(
          ContractJson.contractAddress,
          ContractJson.abi,
          signer
        );
        const filter = auctionContract.filters.commitAmountPayEvent(
          address,
          id
        );
        const events = await contract.queryFilter(filter, 0, 'latest');
        if (events) {
          setisBasePaid(true);
        }
      };
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  }, [id, address]);
  if (isLoading)
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
        <CommitReveal props={{ auctionDetails, id, isBasePaid }} />
      </div>
    </div>
  );
}

export default AuctionDetails;
