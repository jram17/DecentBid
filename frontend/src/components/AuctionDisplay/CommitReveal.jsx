import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
import Reveal from './Reveal';
import Commit from './Commit';
import { useSelector } from 'react-redux';
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
  } = props;
  const address = useSelector((state) => state.address.address);

  const minAmount = auctionDetails.min_eth || auctionDetails.max_eth;

  const [isRevealEnabled, setIsRevealEnabled] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
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
      <div>
        <h1>
          To participate in the auction, pay the minimum amount:
          <br /> {minAmount} ETH
        </h1>
        <button onClick={payMinAmount}>Pay {minAmount} ETH</button>
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
    !isRevealPhaseDone &&
    !revealDone
  ) {
    return (
      <Reveal
        connectWallet={connectWallet}
        id={id}
        setRevealDone={setRevealDone}
      />
    );
  }

  if (!auctionDetails.isRevealEnabled) {
    return (
      <div>
        <h1>The reveal phase will be started soon</h1>
      </div>
    );
  }

  if (!auctionDetails.isWinnerAnnounced && isRevealPhaseDone && revealDone) {
    return (
      <div>
        <h1>The auction is over. the winner is not annouced yet</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>the auction is over</h1>
    </div>
  );
};

export default CommitReveal;
