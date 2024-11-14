import React from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers, utils } from 'ethers';
const { keccak256, defaultAbiCoder, parseUnits } = utils;

import ContractJson from '@/../contract.json';
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
    } catch (error) {
      console.error('error while revealing the bid amount', error);
      alert('Reveal failed!! !');
    }
  };
  return (
    <div>
      <h1> Welcome to Reveal phase</h1>
      <p>Enter your bid and secret salt here:</p>
      <br />
      <form
        onSubmit={handleSubmit(onSubmitRevealbid)}
        className="gap-4 flex flex-col w-full max-w-md m-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white"
      >
        <div>
          <input
            type="text"
            placeholder="BID amount "
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Reveal Bid
        </button>
      </form>
    </div>
  );
};

export default Reveal;
