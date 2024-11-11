// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./auction/Auction.sol";
import "hardhat/console.sol";

contract Main {
    struct AuctionHistory{
        address payable owner;
        Auction auction;
    }
    mapping(string =>AuctionHistory ) public _auctiondetails;
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
        _auctiondetails[auctionId].owner.transfer(msg.value);  
    }
    function payCommitBid(string memory auctionId) public payable {
        _auctiondetails[auctionId].owner.transfer(msg.value);  
    }
    function signCommit(string memory auctionId , bytes32 bidAmt, string memory secretSalt) public payable {
         _auctiondetails[auctionId].auction.commit(bidAmt, secretSalt);
    }
    function signReveal(string memory auctionId,uint bidAmt, string memory secretSalt) public payable {
        _auctiondetails[auctionId].auction.revealBid(bidAmt, secretSalt);
    }

}
