// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./auction/Auction.sol";
import "hardhat/console.sol";

contract Main {
    event BaseAmountPayEvent(address indexed bidder, string indexed auctionId);
    event commitAmountPayEvent(
        address indexed bidder,
        string indexed auctionId
    );
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

        Auction _auction = new Auction(_minamount, auctionId, msg.sender);
        _auctiondetails[auctionId].owner = payable(msg.sender);
        _auctiondetails[auctionId].contract_address = payable(
            address(_auction)
        );
        _auctiondetails[auctionId].auction = _auction;
    }

    modifier onlyBidder(address bidderAddress, string memory auctionId) {
        address auctioncreator = _auctiondetails[auctionId].auction._auctionowner();
        console.log("auction owner address:", auctioncreator);
        console.log("senders address:", bidderAddress);
        require(auctioncreator != bidderAddress, "Only bidders are allowed!");
        _;

    }

    function payminamount(
        string memory auctionId
    ) public payable onlyBidder(msg.sender, auctionId) {
        uint256 _minamount = _auctiondetails[auctionId].auction._minamount();
        require(msg.value == _minamount, "pay min amount!!");
        (bool sent, ) = _auctiondetails[auctionId].contract_address.call{
            value: msg.value
        }("");
        require(sent, "Failed to pay the minimum amount");
        emit BaseAmountPayEvent(msg.sender, auctionId);
    }

    function signCommit(
        string memory auctionId,
        bytes32 hash
    ) public payable onlyBidder(msg.sender, auctionId) {
        _auctiondetails[auctionId].auction.commit(msg.sender, hash);
    }

    function signReveal(
        string memory auctionId,
        uint256 bidAmt,
        string memory secretSalt
    ) public payable onlyBidder(msg.sender, auctionId) {
        _auctiondetails[auctionId].auction.revealBid(msg.sender,bidAmt, secretSalt);
    }

    function getHash(uint256 num) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(num));
    }

    function payCommitBidAmount(
        string memory auctionId
    ) public payable onlyBidder(msg.sender, auctionId) {
        (bool sent, ) = _auctiondetails[auctionId].contract_address.call{
            value: msg.value
        }("");
        require(sent, "Failed to pay commitBid");
        emit commitAmountPayEvent(msg.sender, auctionId);
    }
}
