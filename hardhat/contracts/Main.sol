// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./auction/Auction.sol";
import "hardhat/console.sol";

contract Main {
    mapping(string => Auction) public _auctiondetails;
    address payable public Owner;

    constructor() {
        Owner = payable(msg.sender);
    }

    function createAuction(
        uint256 _minamount,
        string memory auctionId
    ) public payable {
        require(msg.value > 0, "Payment must be greater than zero");

        (bool sent, ) = Owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether to Owner");

        Auction _auction = new Auction(_minamount, auctionId);

        _auctiondetails[auctionId] = _auction;
    }

    function payminamount(string memory auctionId) public payable {
        Auction auction = _auctiondetails[auctionId];
        auction.payminAmount();
    }
}
