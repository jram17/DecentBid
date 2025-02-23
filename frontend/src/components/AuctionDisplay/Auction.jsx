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
    <div className=' min-h-full w-full h-screen bg-gray-200 p-8'>
      <div className='flex flex-col p-4'>
        <div className='' id='auction-title'>
          <h1 className='text-3xl font-semibold'>
            {toTitleCase(props.props.auctionname)}
          </h1>
        </div>

        <div className='py-4  w-[90%] max-h-[400px] rounded-md' id='aution-cover-img'>
          <img src={props.props.cover_image} alt={props.props.autionproduct} />
        </div>

        <div className='py-4  ' id='auction-product-description'>
          <h2 className='whitespace-normal break-words text-xl font-semibold'>{props.props.auctionproduct}</h2>
          <p className='mt-2 whitespace-normal break-words text-md font-light'>{props.props.description}</p>

          <div className='flex flex-row pt-2'><div className='font-semibold mr-2'>Minimum Bid Price :</div>{' '}<span>{props.props.min_eth || props.props.max_eth} ETH</span>
          </div>
          <div className='flex flex-row pt-2'><div className='font-semibold mr-2'>Start of Auction :</div>{' '}<span>{getCreatedDates(props.props.start_of_auction)}</span>
          </div>
          <div className='flex flex-row pt-2'><div className='font-semibold mr-2'>Winner :</div>
            {props.props.isWinnerAnnounced ? (
              <span>{props.props.winner}</span>
            ) : (
              <span>Yet to be announced</span>
            )}
          </div>

          <div>
            {isPictures ? (
              <div className="flex flex-col py-2 ">
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
        </div>
      </div>
    </div>
  );
};

export default Auction;



// {
//   <div className="w-full min-h-full grid place-items-start h-screen bg-blue-700">
//   <Card className="min-w-full shadow-none border-none flex flex-col gap-4">
//     <CardHeader>
//       <CardTitle>{toTitleCase(props.props.auctionname)}</CardTitle>
//     </CardHeader>
//     <CardContent className="flex flex-col gap-3">
//       <img
//         src={props.props.cover_image}
//         className="w-[90%] max-h-[400px] rounded border border-black"
//       />
//       <CardDescription className="flex flex-col gap-1">
//         Auction Product:{' '}
//         <span>{toTitleCase(props.props.auctionproduct)}</span>
//       </CardDescription>
//       <CardDescription className="flex flex-col gap-1">
//         Auction Description:
//         <span>{props.props.description}</span>
//       </CardDescription>
//       <CardDescription className="flex  gap-1">
//         Minimum Bid Price :{' '}
//         <span>{props.props.min_eth || props.props.max_eth} ETH</span>
//       </CardDescription>
//       <CardDescription className="flex  gap-1">
//         Start of Auction:
//         <span>{getCreatedDates(props.props.start_of_auction)}</span>
//       </CardDescription>
//       <CardDescription className="flex gap-1">
//         Winner:
//         {props.props.isWinnerAnnounced ? (
//           <span>{props.props.winner}</span>
//         ) : (
//           <span>Yet to be announced</span>
//         )}
//       </CardDescription>
//       <div>
//         {isPictures ? (
//           <div className="flex flex-col border border-black">
//             <PicturesCarousel extra_pictures={props.props.add_images} />
//             <Button variant="link" onClick={() => setExtraPictures(false)}>
//               Close Pictures
//             </Button>
//           </div>
//         ) : (
//           <Button variant="link" onClick={() => setExtraPictures(true)}>
//             Extra Pictures
//           </Button>
//         )}
//       </div>
//     </CardContent>
//     <CardFooter></CardFooter>
//   </Card>
// </div>
// }