import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import contractDetails from '../../contractDetails.json';

const EventHandlerProvider = ({ children }) => {
  useEffect(() => {
    const listenEvents = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractDetails.contractAddress,
        contractDetails.abi,
        provider
      );
      contract.on('Winner', (winner, auctionId) => {
        console.log('Winner event detected', auctionId);
      });
    };

    listenEvents();
  }, []);

  return <>{children}</>;
};

export default EventHandlerProvider;
