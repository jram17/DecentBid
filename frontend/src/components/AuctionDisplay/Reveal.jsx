import React from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers, utils } from 'ethers';
const { keccak256, defaultAbiCoder, parseUnits } = utils;

import ContractJson from '@/../contract.json';
import { Unlock } from 'lucide-react';
import { toast } from 'sonner';
const Reveal = ({ connectWallet, id, setRevealPhaseDone }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmitRevealbid = async (data) => {
    const { bidAmount, secretSalt } = data;
    const signer = await connectWallet();
    if (!signer) return;

    const contractAddress = ContractJson.contractAddress;
    const contractABI = ContractJson.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // const bidAmountInWei = ethers.utils.parseUnits(bidAmount.toString(),'ether');
    try {
      const weiValue = parseUnits(bidAmount.toString(), 18);

      const tx = await contract.signReveal(id, weiValue, secretSalt);
      await tx.wait();

      alert('Reveal successfull!!');
      setRevealPhaseDone(true); //setting the use state
      toast.success("Reveal successfull!")
    } catch (error) {
      console.error('error while revealing the bid amount', error);
      alert('Reveal failed!! !');
    }
  };
  return (
    <div className='max-w-md  p-8 border border-gray-200 rounded-lg shadow-lg bg-white'>
    <div className=''>
      <h1 className="text-2xl font-semibold text-purple-700">Reveal Phase</h1>
      <h1 className='text-muted-foreground py-2'> Welcome to Reveal phase! Enter your bid and secret salt below</h1>
    </div>



    <form
      onSubmit={handleSubmit(onSubmitRevealbid)}
      className="gap-4 flex flex-col w-full max-w-md m-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white"
    >
      <div>
        <input
          type="text"
          placeholder="BID amount "
          className="w-full px-4 py-2 border border-gray-300
           rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          {...register('bidAmount', {
            required: 'Bid amount is required',
            pattern: {
              value: /^\d+(\.\d+)?$/,
              message: 'Invalid  format. Must be a number',
            },
          })}
        />
        {errors.bidHash && (
          <p style={{ color: 'red' }}>{errors.bidHash.message}</p>
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
          <p style={{ color: 'red' }}>{errors.secretSalt.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex flex-row
         justify-center items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700
         text-white shadow-md group p-3 rounded-lg"
      >
        <Unlock className='w-4 h-4 mr-2 transition-transform group-hover:scale-110' />
        Reveal Bid
      </button>
    </form>
  </div>
  );
};

export default Reveal;
