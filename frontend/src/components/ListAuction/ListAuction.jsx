import React from 'react';
import AuctionCard from './AuctionCard';
import { Card } from '../ui/card';

const ListAuction = ({ auctions }) => {
  if (!auctions || auctions.length === 0) {
    return (
      <Card>
        <h1>No Auctions Found</h1>
      </Card>
    );
  }

  return (
<div className="w-full flex justify-center">
  <div className="grid grid-cols-3 gap-10 ">
    {auctions.map((auction, index) => (
      <AuctionCard auction={auction} key={index} />
    ))}
  </div>
</div>


  );
};

export default ListAuction;
