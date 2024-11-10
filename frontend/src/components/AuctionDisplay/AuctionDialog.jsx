import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
const AuctionDialog = ({ auction }) => {
  const [isLoading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger>Edit Details</DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>Can Stage for the Auction</DialogTitle>
          <DialogDescription>Auction :{auction.auctionname}</DialogDescription>
          <DialogDescription>
            Product :{auction.auctionproduct}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full p-4 flex items-center justify-center">
          <Button variant="primary">Start Reveal Phase</Button>
          <Button variant="primary">End Auction</Button>
          <Button variant="primary">Transfer Funds</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionDialog;
