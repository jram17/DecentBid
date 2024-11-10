import React from 'react'
import { useForm } from 'react-hook-form';
import { BigNumber, ethers } from 'ethers';
import ContractJson from '@/../contract.json';
const Reveal = ({ connectWallet , id , setRevealStatus}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmitRevealbid = async (data) => {
        console.log("Form Data for reveal:", data);
        const { bidAmount, secretSalt } = data;
        console.log( typeof(bidAmount));
        const signer = await connectWallet();
        if (!signer) return;

        const contractAddress = ContractJson.contractAddress;
        const contractABI = ContractJson.abi;
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const bidAmountInWei = ethers.utils.parseUnits(bidAmount.toString(), 'ether');
        try {
            const tx = await contract.signReveal(id, bidAmountInWei, secretSalt);
            await tx.wait();
            setRevealStatus(false);

            alert('Reveal successfull!!');

        } catch (error) {
            console.error("error while revealing the bid amount", error);
            alert("Reveal failed!! !")
        }
    }
    return (
        <div>
            <h1> Welcome to Reveal phase</h1>
            <p>Enter your bid and secret salt here:</p>


            <form onSubmit={handleSubmit(onSubmitRevealbid)} className='gap-2 flex flex-col w-full m-2 justify-center '>
                <div>
                    <input
                        type="text"
                        placeholder="BID amount "
                        {...register("bidAmount", {
                            required: "Bid amount is required",
                            pattern: {
                                value: /^\d+(\.\d+)?$/,
                                message: "Invalid  format. Must be a number"
                            }
                        })}
                    />
                    {errors.bidHash && <p style={{ color: "red" }}>{errors.bidHash.message}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Secret Salt"
                        {...register("secretSalt", {
                            required: "Secret salt is required",
                            minLength: {
                                value: 3,
                                message: "Salt should be at least 3 characters"
                            }
                        })}
                    />
                    {errors.secretSalt && <p style={{ color: "red" }}>{errors.secretSalt.message}</p>}
                </div>

                <button type="submit">Reveal Bid</button>
            </form>
        </div>
    )
}

export default Reveal
