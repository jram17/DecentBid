import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DataTable } from '@/components/Tables/OwningAuctionsTable';
import error_img from '../../public/error-icon.png';
import { getCreatedDates, IdUtils } from '@/utils/AuctionDetailsUtils';
const OwningAuctions = () => {
  const address = useSelector((state) => state.address.address);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`/auctions/own-auctions/${address}`);
        const auctions = [];
        if (response.data) {
          response.data.forEach((ele) => {
            if (ele._id) {
              const {
                auctionId,
                auctionname,
                createdAt,
                auctionproduct,
                isWinnedAnnouced,
                isRevealEnabled,
              } = ele;

              auctions.push({
                auctionId: IdUtils(auctionId),
                auctionname,
                auctionproduct,
                createdAt: getCreatedDates(createdAt),
                isWinnedAnnounced: ele.isWinnerAnnounced
                  ? 'winner'
                  : 'Yet to be Decided',
                isRevealEnabled,
              });
            }
          });
        }
        setAuctions(auctions);
      } catch (error) {
        setError(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, [address]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <span className="text-nowrap text-2xl">Loading</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <img
          src={error_img}
          alt="Connect Icon"
          className="h-[200px] w-[200px]"
        />
        <span className="text-nowrap text-2xl text-red-500">{error}</span>
      </div>
    );
  }
  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-[#002B5B] font-semibold text-3xl mb-6">
        Owning Auctions
      </h1>
      <DataTable data={auctions} />
    </div>
  );
};

export default OwningAuctions;
