import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCreatedDates, toTitleCase } from '@/utils/AuctionDetailsUtils';
import { AddressUtils } from '@/utils/AddressUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '../ui/badge';
import { Book } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
  return (
    <div>
      <Card className="max-w-[450px] w-[450px] max-h-[300px] flex flex-col items-start justify-around shadow-md gap-3">
        <CardHeader>
          <CardTitle>{toTitleCase(auction.auctionname)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full items-start gap-1">
          <CardDescription>
            {toTitleCase(auction.auctionproduct)}
          </CardDescription>
          <CardDescription>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p>Owner: {AddressUtils(auction.owner)}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{auction.owner}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <p>ProductValue: {auction.max_eth || '0.06'}</p>{' '}
          <p>StartDate: {getCreatedDates(auction.start_of_auction)}</p>
          <div className="flex items-center justify-center  gap-1">
            <Badge>
              {new Date(auction.start_of_auction) > new Date()
                ? 'Yet to Start'
                : 'Started'}
            </Badge>
            <Button variant={'link'}>
              <Book size={16} />{' '}
              <Link to={`/auctions/${auction.auctionId}`}>View Details</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuctionCard;
