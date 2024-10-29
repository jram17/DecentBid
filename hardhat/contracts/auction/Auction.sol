// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "hardhat/console.sol";

contract Auction {
    struct BidDetails {
        address _bidder;
        string _bidHash;
        uint256 _bidamount;
        bool _isRevealed;
    }
    struct UserStatus {
        address payable _bidder;
        bool _isChecked;
    }

    UserStatus[] _bidders;
    uint256 _maxbidamount;
    address payable _auctionowner;
    string _auctionid;
    mapping(address => BidDetails) _biddetails;

    constructor(uint256 maxbidamount, string memory auctionId) {
        _auctionowner = payable(msg.sender);
        _auctionid = auctionId;
        _maxbidamount = maxbidamount;
    }

    function getAuctionWinner() public payable {
        require(
            msg.sender == _auctionowner,
            "Only the owner can call this function"
        );
        require(_bidders.length > 0, "No bidding has been produced yet");

        uint256 _length = _bidders.length;
        address _minbidder = _bidders[0]._bidder;
        address _secondlastelement;

        for (uint256 i = 1; i < _length; ++i) {
            if (!_biddetails[_bidders[i]._bidder]._isRevealed) continue;
            if (
                _biddetails[_bidders[i]._bidder]._bidamount <
                _biddetails[_minbidder]._bidamount
            ) {
                _secondlastelement = _minbidder;
                _minbidder = _bidders[i]._bidder;
            }
            _bidders[i]._isChecked = true;
        }

        address payable _winner = payable(_minbidder);
        uint256 _amount_to_be_paid = _biddetails[_secondlastelement]._bidamount;

        for (uint256 i = 0; i < _length; ++i) {
            if (_bidders[i]._bidder == _winner) {
                _winner.transfer(_maxbidamount - _amount_to_be_paid);
            } else if (_bidders[i]._isChecked) {
                _bidders[i]._bidder.transfer(_maxbidamount);
            } else {
                _bidders[i]._bidder.transfer(_maxbidamount);
            }
        }
    }
}
