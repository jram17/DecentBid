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
    <div className="w-full grid grid-cols-2 gap-2">
      {auctions.map((auction, index) => (
        <AuctionCard auction={auction} key={index} />
      ))}
    </div>
  );
};

export default ListAuction;
