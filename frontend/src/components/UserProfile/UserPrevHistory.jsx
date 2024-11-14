import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContractJson from '../../../contract.json';
import { ethers } from 'ethers';
import { NavLink } from 'react-router-dom';

const UserPrevHistory = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const address = useSelector((state) => state.address.address);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setisLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        await provider.send('eth_requestAccounts', []);
        const auctionContract = new ethers.Contract(
          ContractJson.contractAddress,
          ContractJson.abi,
          signer
        );
        const filter = auctionContract.filters.Winner(address, null);
        const events = await auctionContract.queryFilter(filter, 0, 'latest');

        setAuctions(() => {
          return events.map((event) => ({
            id: event.args.auctionId,
            winner: event.args.winner,
          }));
        });
      } catch (error) {
        setisError(true);
        console.error(error);
      } finally {
        setisLoading(false);
      }
    };

    if (address) {
      fetchDetails();
    }
  }, [address]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching details</p>}
      {!isLoading && !isError && auctions.length > 0 && (
        <nav>
          <h3>Your Auction History:</h3>
          <ul>
            {auctions.map((auction, index) => (
              <li key={index}>
                <NavLink to={`/auction/${auction.id}`}>
                  Auction ID: {auction.id}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {!isLoading && !isError && auctions.length === 0 && (
        <p>No auctions found.</p>
      )}
    </div>
  );
};

export default UserPrevHistory;
