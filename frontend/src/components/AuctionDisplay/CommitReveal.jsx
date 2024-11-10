import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { ethers } from "ethers";
import ContractJson from '@/../contractDetails.json';


async function connectWallet() {

    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            return signer;
        } catch (error) {
            console.error("User denied account access", error);
            return null;
        }
    }
    else {
        alert("Please install Metamask");
        return null;
    }


}


const CommitReveal = ({ props }) => {
    const { auctionDetails, id } = props;
    const [paidEntry, setPaidEntry] = useState(true);
    const [commitStatus, setCommitStatus] = useState(false);
    const [revealStatus, setRevealStatus] = useState(false);
    const minAmount = auctionDetails.min_eth || auctionDetails.max_eth;
    const form=useForm();
    console.log(id);
    async function payMinAmount() {
        const signer = await connectWallet();
        if (!signer) return;

        const contractAddress = ContractJson.contractAddress;
        const contractABI = ContractJson.abi;
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.payminamount(
                id, {
                value: ethers.utils.parseEther(minAmount.toString()),
            }
            );

            await tx.wait();
            setPaidEntry(false);
            setCommitStatus(true);
            alert("Payment successful!!  Now you can commit your entry.");
        } catch (error) {
            console.error("Error while paying min amount", error);
            alert("Payment failed. Please try again.");
        }
    }

    async function payCommitAmount() {

    }


    if (paidEntry) {

        return (
            <div>
                <h1>To participate in the auction, pay the minimum amount:<br /> {minAmount} ETH</h1>
                <button onClick={payMinAmount} >Pay {minAmount} ETH</button>
            </div>
        );
    }
    if (commitStatus) {
        const toggleRevealStatus = () => {
            setCommitStatus(!commitStatus);
            setRevealStatus(!revealStatus);
        }
        return (
            <div>
                <h1> Welcome to commit phase</h1>

                <p>Enter your bid and secret salt here:</p>
                {/* here you must commit your bid  */}

                {/* for that first go this url:https://keccak-256.4tools.net/  enter your bid */}
                {/* now copy the bid and come back to our website   */}
                {/* 
                now in the form enter the bid hash for the bid amt field
                and enter the secret salt ,the salt  maybe a number or string
                then write code to open meta mask and pay the bid amout 
                make sure you pay the correct amt */}

                {/* <form >
                    <input type="text" placeholder='BID amount' />
                    <input type="text" placeholder='Secret Salt' />
                    <button type='submit'>COMMIT BID</button>
                </form> */}







            </div>
        );
    }

    if (revealStatus) {
        const toggleRevealStatus = () => {
            setRevealStatus(!revealStatus);
        }
        return (
            <div>
                <h1>this is the reveal phase</h1>
            </div>
        )
    }

    return (
        <div>
            <h1>the auction is over</h1>
        </div>
    )

}

export default CommitReveal;
