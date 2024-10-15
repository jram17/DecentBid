// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Auction {
    address payable _auctionowner;

    constructor() {
        _auctionowner = payable(msg.sender);
    }
}
