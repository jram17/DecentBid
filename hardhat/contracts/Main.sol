// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "./auction/Auction.sol";

contract Main {
    mapping(address auction_owner => Auction _auctioninstance)
        public _auctiondetails;
    address payable public Owner;

    constructor() {
        Owner = payable(msg.sender);
    }

    function createAuction() public {}
}
