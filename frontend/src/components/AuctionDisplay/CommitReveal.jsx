import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
import Reveal from './Reveal';
import Commit from './Commit';
import { useSelector } from 'react-redux';
import { Badge } from '../ui/badge';
import { AlertTriangle, Hourglass, Loader, Loader2, LoaderPinwheel } from 'lucide-react';
async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return signer;
    } catch (error) {
      console.error('User denied account access', error);
      return null;
    }
  } else {
    alert('Please install Metamask');
    return null;
  }
}

const CommitReveal = ({ props }) => {
  const {
    auctionDetails,
    id,
    isBasePaid,
    setisBasePaid,
    isCommitPhaseDone,
    setCommitPhaseDone,
    isRevealPhaseDone,
    setRevealPhaseDone,
  } = props;
  const address = useSelector((state) => state.address.address);

  const minAmount = auctionDetails.min_eth || auctionDetails.max_eth;

  const [isRevealEnabled, setIsRevealEnabled] = useState(false);


  async function payMinAmount() {
    const signer = await connectWallet();
    if (!signer) return;
    const contractAddress = ContractJson.contractAddress;
    const contractABI = ContractJson.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      let amount = '0';
      if (minAmount) {
        amount = minAmount.toString();
      }
      const value = ethers.utils.parseEther(amount);
      const tx = await contract.payminamount(id, {
        value: value,
      });

      const receipt = await tx.wait();
      setisBasePaid(true);
      alert('Payment successful!!  Now you can commit your entry.');

    } catch (error) {
      console.error('Error while paying min amount', error);
      alert('Payment failed. Please try again.');
    }
  }



  if (!isBasePaid) {
    return (
      <div className='flex flex-col justify-start items-start text-white '>
        <h1 className='text-2xl font-semibold'>Participate</h1>
        <h1 className='flex flex-col  items-center '>
          <div className='py-4'>
            To participate in the Auction,<br />
            pay the minimum amount:     {minAmount} ETH</div>

        </h1>
        <Badge className={'px-4 py-2 border border-gray-900 hover:scale-105 transition-all  duration-300'} variant={'outline'}> <button
          onClick={payMinAmount}


          // changed
          // onClick={() => setisBasePaid(true) }
        >Pay {minAmount} ETH</button></Badge>

      </div>
    );
  }
  if (!isRevealEnabled && !isCommitPhaseDone) {
    return (
      <Commit
        connectWallet={connectWallet}
        id={id}
        setIsRevealEnabled={setIsRevealEnabled}
        setCommitPhaseDone={setCommitPhaseDone}
      />
    );
  }

  if (
    auctionDetails.isRevealEnabled &&
    isBasePaid &&
    isCommitPhaseDone &&
    !isRevealPhaseDone
  ) {
    return (
      <Reveal
        connectWallet={connectWallet}
        id={id}
        setRevealPhaseDone={setRevealPhaseDone}
      />
    );
  }

  if (!auctionDetails.isRevealEnabled) {
    return (
      <div className="flex flex-col justify-start   px-4 ">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center">
          <h1 className="text-2xl font-bold text-purple-700">⏳ Reveal Phase ...</h1>
          <p className="text-gray-600 mt-2">
            The reveal phase will begin soon. Please wait...
          </p>

     
          <div className="flex justify-center mt-6">
            <Loader2 className="animate-spin h-24 w-24 text-purple-600" />
          </div>

        </div>
      </div>


    );
  }

  if (!auctionDetails.isWinnerAnnounced && isRevealPhaseDone) {
    return (
      <div className='flex flex-col justify-start   px-4'>
        <div className='bg-white shadow-lg rounded-2xl p-6 max-w-md text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Auction is over </h1>
          <p className='text-gray-600 mt-2 flex'>
            <div className='mr-2 font-semibold'>
              Status :
            </div>
            winner is not yet announced </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-start   m-auto'>
    <div className='bg-white shadow-lg rounded-2xl p-6 max-w-md text-center'>
      <h1 className='text-2xl font-bold text-gray-900 flex flex-row items-center gap-2 '>
        <AlertTriangle className='h-6 w- text-purple-500' />
        Auction is over </h1>

    </div>
  </div>
  );
};

export default CommitReveal;
