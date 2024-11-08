import React, { useState } from 'react';
import { toTitleCase, getCreatedDates } from '@/utils/AuctionDetailsUtils';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import PicturesCarousel from './PicturesCarousel';
import { Button } from '../ui/button';
const Auction = (props) => {
  const [isPictures, setExtraPictures] = useState(false);
  return (
    <div className="w-full min-h-full grid place-items-start">
      <Card className="min-w-full shadow-none border-none flex flex-col gap-4">
        <CardHeader>
          <CardTitle>{toTitleCase(props.props.auctionname)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <img
            src={props.props.cover_image}
            className="w-[90%] max-h-[400px] rounded"
          />
          <CardDescription className="flex flex-col gap-1">
            Auction Product:{' '}
            <span>{toTitleCase(props.props.auctionproduct)}</span>
          </CardDescription>
          <CardDescription className="flex flex-col gap-1">
            Auction Description:
            <span>{props.props.description}</span>
          </CardDescription>
          <CardDescription className="flex  gap-1">
            Minimum Bid Price :{' '}
            <span>{props.props.min_eth || props.props.max_eth} ETH</span>
          </CardDescription>
          <CardDescription className="flex  gap-1">
            Start of Auction:
            <span>{getCreatedDates(props.props.start_of_auction)}</span>
          </CardDescription>
          <CardDescription className="flex gap-1">
            Winner:
            {props.props.isWinnerAnnouced && <span>{'winner'}</span>}
          </CardDescription>
          <div>
            {isPictures ? (
              <div className="flex flex-col">
                <PicturesCarousel extra_pictures={props.props.add_images} />
                <Button variant="link" onClick={() => setExtraPictures(false)}>
                  Close Pictures
                </Button>
              </div>
            ) : (
              <Button variant="link" onClick={() => setExtraPictures(true)}>
                Extra Pictures
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default Auction;
