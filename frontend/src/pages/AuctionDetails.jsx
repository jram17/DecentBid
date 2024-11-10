import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Auction from '@/components/AuctionDisplay/Auction';
import CommitReveal from '@/components/AuctionDisplay/CommitReveal';
function AuctionDetails() {
  const { id } = useParams();
  const [auctionDetails, SetDetails] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/auctions/${id}`);
      console.log(response.data);
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
    <div className='flex'>
    <div className="w-8/12 h-full flex items-center">
      <Auction props={auctionDetails} />
    </div>
    <div className="w-4/12 h-full flex items-center m-8">
      <CommitReveal props={{auctionDetails,id}} />
      </div>
    </div>
  );
}

export default AuctionDetails;
