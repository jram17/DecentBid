// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "hardhat/console.sol";

contract Auction {
    event unRevealed(address indexed bidder, string indexed _auctionid);
    event Winner(address indexed winner, string indexed _auctionid);

    struct BidDetails {
        address _bidder;
        string _bidHash;
        uint256 _bidamount;
        bool _isRevealed;
    }

    address payable[] _bidders;
    uint256 _minamount;
    address payable _auctionowner;
    string _auctionid;
    mapping(address => BidDetails) _biddetails;
    uint256 _amount_to_be_paid;
    address payable _winner;

    constructor(uint256 minamount, string memory auctionId) {
        _auctionowner = payable(msg.sender);
        _auctionid = auctionId;
        _minamount = minamount;
    }

    function getAuctionWinner() public payable {
        require(
            msg.sender == _auctionowner,
            "Only the owner can call this function"
        );
        require(_bidders.length > 0, "No bidding has been produced yet");

        uint256 _length = _bidders.length;
        address _maxbidder = _bidders[0];
        address _secondlastelement;
        if (_length == 1) {
            _winner = _bidders[0];
            _amount_to_be_paid = _biddetails[_winner]._bidamount;
        } else {
            for (uint256 i = 1; i < _length; ++i) {
                if (!_biddetails[_bidders[i]]._isRevealed) {
                    emit unRevealed(_bidders[i], _auctionid);
                    continue;
                }
                if (
                    _biddetails[_bidders[i]]._bidamount >
                    _biddetails[_maxbidder]._bidamount
                ) {
                    _secondlastelement = _maxbidder;
                    _maxbidder = _bidders[i];
                }
            }
        }

        _winner = payable(_maxbidder);
        emit Winner(_winner, _auctionid);
        _amount_to_be_paid = _biddetails[_secondlastelement]._bidamount;
        _auctionowner.transfer(_amount_to_be_paid);
    }

    function transferAmount() public {
        uint256 _length = _bidders.length;
        for (uint256 i = 0; i < _length; ++i) {
            if (_bidders[i] == _winner) {
                _winner.transfer(
                    _biddetails[_bidders[i]]._bidamount - _amount_to_be_paid
                );
            } else if (_biddetails[_bidders[i]]._isRevealed) {
                _bidders[i].transfer(_biddetails[_bidders[i]]._bidamount);
            }
        }
        _auctionowner.transfer(_amount_to_be_paid);
    }
}
