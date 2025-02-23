import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getHashInWei, getTotalHash } from '@/utils/HashUtils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

const Commit = ({
  connectWallet,
  id,
  setIsRevealEnabled,
  setCommitPhaseDone,
}) => {
  const address = useSelector((state) => state.address.address);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      const receipt = await tx.wait();
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



    console.log(data);

    if(data.bidHash === undefined){
      toast.error("Please, calculate Hash !", {
        style: { backgroundColor: "#dc2626", color: "#fff" }, // Tailwind red-600
        iconTheme: { primary: "#fff", secondary: "#dc2626" }, 
      });
      
      return;
    }
    
    // changed 
    // setIsRevealEnabled(true);
    

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
      toast.success("Commit successful!");
    } catch (error) {
      console.error(error.message);
      alert('Commit failed! Please try again.');
    }
  };

  const getNumberHash = async () => {
    try {
      const hashval = getHashInWei(num);
      setHashval(hashval);
      setValue('bidHash', hashval); // Update form value
    } catch (error) {
      console.error('Could not commit the bid amount', error);
      alert('Paying commit bid failed!');
    }
  };

  return (
    <div className="max-w-md  p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-semibold text-purple-700">Commit Phase</h1>
      <p className="text-muted-foreground">
        Welcome to the commit phase! Enter your bid and secret salt below.
      </p>

      <div className="mt-4">
        <label className="font-semibold">Your Bid</label>
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="button"
        className="w-full mt-3 px-4 py-2 border border-gray-400 bg-gray-100 rounded-lg flex items-center justify-center
         text-gray-700 hover:bg-gray-200 transition-all duration-300"
        onClick={getNumberHash}
      >
        <span className="mr-2">#</span> Calculate hash of number
      </button>

      {hashval && (
        <div className="flex flex-col mt-4">
          <label className="block font-semibold">Hash Output</label>
          {/* mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-800 */}
          <div className='mt-1 border border-gray-300  p-3  rounded-lg text-sm text-gray-800'>
            <p className="break-all">{hashval}</p>
          </div>

        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmitCommitBid)}
        className="mt-4 flex flex-col gap-3"
      >
        <div>
          <label className="font-semibold">Secret Salt</label>
          <input
            type="text"
            placeholder="Enter your secret salt"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            {...register('secretSalt', {
              required: 'Secret salt is required',
              minLength: {
                value: 3,
                message: 'Salt should be at least 3 characters',
              },
            })}
          />
          {errors.secretSalt && (
            <p className="text-red-600 text-sm">{errors.secretSalt.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex flex-row justify-center items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md group p-3 rounded-lg"
        >
          <Lock className='w-4 h-4 mr-2 transition-transform group-hover:scale-110'/>
          COMMIT BID
        </button>
      </form>
    </div>



  );
};

export default Commit;
