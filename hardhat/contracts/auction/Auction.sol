// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "hardhat/console.sol";

contract Auction {
    uint256 _maxbidamount;
    address payable _auctionowner;

    constructor(uint256 maxbidamount) {
        _auctionowner = payable(msg.sender);
        _maxbidamount = maxbidamount;
    }
}
