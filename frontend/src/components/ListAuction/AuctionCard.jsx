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
    <div className='group relative rounded-2xl  shadow-md max-w-lg min-w-lg transition-all duration-300 overflow-hidden border-gray-300 border hover:scale-105'>
      <div className='flex flex-col gap-6 group bg-white/90 pb-4 '>
        <div className='h-48 w-full object-cover rounded-t-2xl shadow-inner'>
          <img src={auction.cover_image} alt={auction.product}
            className="h-48 w-full object-cover rounded-t-2xl shadow-inner" />
        </div>
        <div className='px-4 flex flex-col gap-2 items-start ' >
          <h1 className='text-xl font-semibold max-w-full whitespace-normal break-words'>
            {auction.auctionname}
          </h1>
          <h3 className='mt-2 max-w-full whitespace-normal break-words '>{auction.auctionproduct}</h3>
          <div className='mt-2 '>
            <TooltipProvider >
              <Tooltip>
                <TooltipTrigger>
                  <p className='flex flex-row'><div className='font-semibold pr-1'>Owner:</div> {AddressUtils(auction.owner)}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{auction.owner}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='pb-2'>
            <p className='flex flex-row '><div className='font-semibold'>value:</div> {auction.max_eth || '0.06'}</p>{' '}
            <p className='flex flex-row'><div className='font-semibold'>start-date:</div> {getCreatedDates(auction.start_of_auction)}</p>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;





// {
//   <Card className="max-w-[450px] w-[450px] max-h-[300px] flex flex-col items-start justify-around shadow-md gap-3">
//         <CardHeader>
//           <CardTitle>{toTitleCase(auction.auctionname)}</CardTitle>
//         </CardHeader>
//         <CardContent className="flex flex-col w-full items-start gap-1">
//           <CardDescription>
//             {toTitleCase(auction.auctionproduct)}
//           </CardDescription>
//           <CardDescription>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger>
//                   <p>Owner: {AddressUtils(auction.owner)}</p>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>{auction.owner}</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </CardDescription>
//         </CardContent>
//         <CardFooter className="flex flex-col items-start gap-2">
//           <p>ProductValue: {auction.max_eth || '0.06'}</p>{' '}
//           <p>StartDate: {getCreatedDates(auction.start_of_auction)}</p>
//           <div className="flex items-center justify-center  gap-1">
//             <Badge>
//               {new Date(auction.start_of_auction) > new Date()
//                 ? 'Yet to Start'
//                 : 'Started'}
//             </Badge>
//             <Button variant={'link'}>
//               <Book size={16} />{' '}
//               <Link to={`/auctions/${auction.auctionId}`}>View Details</Link>
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
// }