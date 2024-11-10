// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./auction/Auction.sol";
import "hardhat/console.sol";

contract Main {
    struct AuctionHistory {
        address payable owner;
        Auction auction;
    }
    mapping(string => AuctionHistory) public _auctiondetails;
    address payable public Owner;

    constructor() {
        Owner = payable(msg.sender);
    }

    function createAuction(
        uint256 _minamount,
        string memory auctionId
    ) public payable {
        console.log(_minamount);
        require(msg.value > 0, "Payment must be greater than zero");

        (bool sent, ) = Owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether to Owner");

        Auction _auction = new Auction(_minamount, auctionId);
        _auctiondetails[auctionId].owner = payable(msg.sender);
        _auctiondetails[auctionId].auction = _auction;
    }

    function payminamount(string memory auctionId) public payable {
        console.log("here1");
        _auctiondetails[auctionId].owner.transfer(msg.value); // This line is causing the error;;
        console.log("here2", msg.value);
        console.log("here3");
    }

    // function signCommit(string memory auctionId,bytes32 amtHash,string memory secretSalt) public payable {
    //     Auction auction = _auctiondetails[auctionId];
    //     auction.commit(amtHash, secretSalt);
    // }

    // function payCommitBid(string memory auctionId) public payable {
    //     console.log("inn");
    //     Auction auction = _auctiondetails[auctionId];
    //     auction.payCommitBidAmount();
    // }

    // function signReveal(string memory auctionId ,uint bidAmt, string memory secretSalt) public payable {
    //     Auction auction = _auctiondetails[auctionId];
    //     auction.revealBid(bidAmt, secretSalt);
    // }
}
