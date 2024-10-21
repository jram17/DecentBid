// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "hardhat/console.sol";

contract Auction {
    uint256 _minbidamount;
    address payable _auctionowner;

    constructor(uint256 minbidamount) {
        _auctionowner = payable(msg.sender);
        _minbidamount = minbidamount;
    }
}
