import { ethers } from "ethers";
import ContractJson from '../../contract.json';
import axios from 'axios';

const CreateAuction = async (value, auctionId) => {
    const wei = ethers.utils.parseEther(value.toString() || '0');

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const auctionContract = new ethers.Contract(
            ContractJson.contractAddress,
            ContractJson.abi,
            signer
        );

        const tx = await auctionContract.createAuction(
            wei, auctionId, {
            value: ethers.utils.parseEther(value.toString()),
        })
        await tx.wait();


        return {
            success: true,
            message: "Auction created successfully",

        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create auction",
            error: error.message,
        };
    }
};

const RevealWinner = async (id) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const auctionContract = new ethers.Contract(
            ContractJson.contractAddress,
            ContractJson.abi,
            signer
        );

        const tx = await auctionContract.getWinner(id);
        const receipt = await tx.wait();
        const body = {
            id: id,
            winner: receipt.events[0].args[0],
        }
        const response = await axios.put('/auctions/reveal-winner', body);
        if (response.status === 200) {
            return {
                success: true,
                message: "Winner revealed successfully",
            };
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


const transferAmount = async (id) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const auctionContract = new ethers.Contract(
            ContractJson.contractAddress,
            ContractJson.abi,
            signer
        );

        const tx = await auctionContract.transferAmount(id);
        const receipt = await tx.wait();

        return {
            success: true,
            message: "Amount transferred successfully",
        };

    } catch (error) {
        throw new Error(error.message);

    }
}

export { CreateAuction, RevealWinner, transferAmount };




