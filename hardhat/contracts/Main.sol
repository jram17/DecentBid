// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./auction/Auction.sol";
import "hardhat/console.sol";

contract Main {
    event BaseAmountPayEvent(address indexed bidder, string indexed auctionId);
    struct AuctionHistory {
        address payable contract_address;
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
        require(msg.value > 0, "Payment must be greater than zero");

        (bool sent, ) = Owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether to Owner");

        Auction _auction = new Auction(_minamount, auctionId);
        _auctiondetails[auctionId].owner = payable(msg.sender);
        _auctiondetails[auctionId].contract_address = payable(
            address(_auction)
        );
        _auctiondetails[auctionId].auction = _auction;
    }
    
    function payminamount(string memory auctionId) public payable {
        (bool sent, ) = _auctiondetails[auctionId].contract_address.call{
            value: msg.value
        }("");
        require(sent, "Failed to pay the minimum amount");
        emit BaseAmountPayEvent(msg.sender, auctionId);
    }
}
