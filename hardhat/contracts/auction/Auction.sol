// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "hardhat/console.sol";

contract Auction {
    address payable _auctionowner;

    constructor() {
        _auctionowner = payable(msg.sender);
    }
}
