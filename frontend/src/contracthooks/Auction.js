import { ethers } from "ethers";
import ContractJson from '../../contractDetails.json';


const CreateAuction = async (value, auctionId) => {
    const wei = ethers.utils.parseEther(value.toString());

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
        console.log(error);
        return {
            success: false,
            message: "Failed to create auction",
            error: error.message,
        };
    }
};

export { CreateAuction };




