import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function AuctionDetails() {
  const { id } = useParams();
  const [auctionDetails, SetDetails] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false);
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
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching auction details.</div>;
  return <div></div>;
}

export default AuctionDetails;
