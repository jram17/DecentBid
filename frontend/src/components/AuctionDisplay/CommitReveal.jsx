import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
import Reveal from './Reveal';
import Commit from './Commit';
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
  const { auctionDetails, id } = props;
  const [paidEntry, setPaidEntry] = useState(true);
  const [commitStatus, setCommitStatus] = useState(false);
  const [revealStatus, setRevealStatus] = useState(false);
  // const [auctionResult, setAuctionResult] = useState(false);
  const minAmount = auctionDetails.min_eth || auctionDetails.max_eth;

  // const { register, handleSubmit, formState: { errors } } = useForm();

  console.log(id);
  async function payMinAmount() {
    const signer = await connectWallet();
    if (!signer) return;

    const contractAddress = ContractJson.contractAddress;
    const contractABI = ContractJson.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.payminamount(id, {
        value: ethers.utils.parseEther(minAmount.toString()),
      });

      await tx.wait();
      setPaidEntry(false);
      setCommitStatus(true);
      alert('Payment successful!!  Now you can commit your entry.');
    } catch (error) {
      console.error('Error while paying min amount', error);
      alert('Payment failed. Please try again.');
    }
  }

  if (paidEntry) {
    return (
      <div>
        <h1>
          To participate in the auction, pay the minimum amount:
          <br /> {minAmount} ETH
        </h1>
        <button onClick={payMinAmount}>Pay {minAmount} ETH</button>
      </div>
    );
  }
  if (commitStatus) {
    return (
      <Commit
        connectWallet={connectWallet}
        id={id}
        setCommitStatus={setCommitStatus}
        setRevealStatus={setRevealStatus}
      />
    );
  }

  if (revealStatus) {
    return (
      <Reveal
        connectWallet={connectWallet}
        id={id}
        setRevealStatus={setRevealStatus}
      />
    );
  }

  return (
    <div>
      <h1>the auction is over</h1>
    </div>
  );
};

export default CommitReveal;
