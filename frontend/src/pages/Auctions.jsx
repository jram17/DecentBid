import axios from 'axios';
import ListAuction from '@/components/ListAuction/ListAuction';
import { useEffect, useState } from 'react';
function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get('/auctions');
        setAuctions(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setisLoading(false);
      }
    };
    fetchAuctionDetails();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {auctions ? <ListAuction auctions={auctions} /> : 'No auctions ...'}
    </div>
  );
}

export default Auctions;
