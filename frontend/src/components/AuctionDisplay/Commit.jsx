import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getHashInWei, getTotalHash } from '@/utils/HashUtils';
import axios from 'axios';
import { useSelector } from 'react-redux';
const Commit = ({ connectWallet, id, setIsRevealEnabled }) => {
  const address = useSelector((state) => state.address.address);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [hashval, setHashval] = useState('');
  const [num, setNum] = useState(0);

  async function payCommitAmount(num, totalHash) {
    const signer = await connectWallet();
    if (!signer) return;

    const contractAddress = ContractJson.contractAddress;
    const contractABI = ContractJson.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const value = ethers.utils.parseEther(num.toString());
      const tx = await contract.payCommitBidAmount(id, totalHash, { value });
      await tx.wait();
      const response = await axios.put('/auctions/user-auctions', {
        address,
        auctionId: id,
      });
      if (response.status === 200) {
        setIsRevealEnabled(true);
      }

      // setCommitPaid(true);
      alert('Successfully paid commit bid!');
    } catch (error) {
      console.error('Could not commit the bid amount', error);
      alert('Paying commit bid failed!');
    }
  }

  const onSubmitCommitBid = async (data) => {
    // if (!isCommitPaid) return;
    // if (!isCommitPhaseDone) return;
    // if (!isAmountPaid) {
    //   alert('Please pay the commit amount first!');
    //   return;
    // }

    const { bidHash, secretSalt } = data;
    const totalHash = getTotalHash(bidHash, secretSalt);

    // const signer = await connectWallet();
    // if (!signer) return;

    // const contractAddress = ContractJson.contractAddress;
    // const contractABI = ContractJson.abi;
    // const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      // const tx = await contract.signCommit(id, totalHash);
      // await tx.wait();
      // alert('Commit successful!');
      await payCommitAmount(num, totalHash);
    } catch (error) {
      console.error(error.message);
      alert('Commit failed! Please try again.');
    }
  };

  const getNumberHash = async () => {
    try {
      const hashval = getHashInWei(num);
      setHashval(hashval);
      // await payCommitAmount(num);
    } catch (error) {
      console.error('Could not commit the bid amount', error);
      alert('Paying commit bid failed!');
    }
  };

  return (
    <div>
      <h1>Welcome to the commit phase</h1>

      <p>Enter your bid and secret salt here:</p>
      <Input value={num} onChange={(e) => setNum(e.target.value)} />
      <Button type="button" onClick={() => getNumberHash()}>
        Calculate hash of number
      </Button>

      <form
        onSubmit={handleSubmit(onSubmitCommitBid)}
        className="gap-4 flex flex-col w-full max-w-md m-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white"
      >
        <div>
          <input
            type="text"
            placeholder="BID amount hash"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={hashval || ''}
            readOnly
            {...register('bidHash', {
              required: 'Bid hash is required',
              pattern: {
                value: /^0x[a-fA-F0-9]{64}$/,
                message: 'Invalid hash format. Must be 64-character hex.',
              },
            })}
          />
          {errors.bidHash && (
            <p className="text-red-600 mt-1 text-sm">
              {errors.bidHash.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Secret Salt"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('secretSalt', {
              required: 'Secret salt is required',
              minLength: {
                value: 3,
                message: 'Salt should be at least 3 characters',
              },
            })}
          />
          {errors.secretSalt && (
            <p className="text-red-600 mt-1 text-sm">
              {errors.secretSalt.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
        >
          COMMIT BID
        </button>
      </form>
    </div>
  );
};

export default Commit;
