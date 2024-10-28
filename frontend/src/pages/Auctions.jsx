import axios from 'axios';
import ListAuction from '@/components/ListAuction/ListAuction';
import { useEffect, useState } from 'react';
function Auctions() {
  const [auctions, setAuctions] = useState(null);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get('/auctions');
        console.log(response);
        setAuctions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuctionDetails();
  }, []);
  return (
    <div>
      <ListAuction />
    </div>
  );
}

export default Auctions;
