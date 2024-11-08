import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Auction from '@/components/AuctionDisplay/Auction';
function AuctionDetails() {
  const { id } = useParams();
  const [auctionDetails, SetDetails] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
  useEffect(() => {
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
    <div className="w-full h-full flex items-center">
      <Auction props={auctionDetails} />
    </div>
  );
}

export default AuctionDetails;
