import React from 'react';
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
const Commit = ({ connectWallet, id, setCommitStatus, setRevealStatus }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function payCommitAmount() {
    const signer = await connectWallet();
    if (!signer) return;

    const contractAddress = ContractJson.contractAddress;
    const contractABI = ContractJson.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const tx = await contract.payCommitBid(id, {});
      await tx.wait();
      setCommitStatus(false);
      setRevealStatus(true);
      alert('successfully paid commit bid!!');
    } catch (error) {
      console.error('could not commit the bid amt', error);
      alert('paying commit bid failed!! ');
    }
  }

  const onSubmitCommitBid = async (data) => {
    const { bidHash, secretSalt } = data;

    const signer = await connectWallet();
    if (!signer) return;

    const contractAddress = ContractJson.contractAddress;
    const contractABI = ContractJson.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // converting to bytes32
    const bidHashBytes32 = ethers.utils.arrayify(bidHash);
    try {
      const tx = await contract.signCommit(id, bidHashBytes32, secretSalt);
      await tx.wait();
      alert('commit successfull!!');
      payCommitAmount();
    } catch (error) {
      console.error(error.message);
      alert('Commit failed!! please try again!!');
    }
  };

  return (
    <div>
      <h1> Welcome to commit phase</h1>

      <p>Enter your bid and secret salt here:</p>

      <br />
      <a href="https://keccak-256.4tools.net/" target="_blank">
        Calculate hash
      </a>
      <br />
      <form
        onSubmit={handleSubmit(onSubmitCommitBid)}
        className="gap-2 flex flex-col w-full m-2 justify-center "
      >
        <div>
          <input
            type="text"
            placeholder="BID amount hash"
            {...register('bidHash', {
              required: 'Bid hash is required',
              pattern: {
                value: /^0x[a-fA-F0-9]{64}$/,
                message: 'Invalid hash format. Must be 64-character hex.',
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

        <button type="submit">COMMIT BID</button>
      </form>
    </div>
  );
};

export default Commit;
