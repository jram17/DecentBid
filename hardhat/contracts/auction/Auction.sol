// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "hardhat/console.sol";

contract Auction {
    receive() external payable {}

    event unRevealed(address indexed bidder, string indexed _auctionid);
    event Winner(address indexed winner, string indexed _auctionid);
    event BidCommitted(address indexed bidder, string indexed auctionId);

    event BidCommitted(
        address indexed bidder,
        bytes32 bidHash,
        string auctionId
    );

    struct BidDetails {
        bytes32 _bidHash;
        string _secretSalt;
        uint256 _bidamount;
        bool _hasBid;
        bool _hasRevealed;
    }

    address payable[] _bidders;
    uint256 public _minamount;
    address payable public _auctionowner;
    string _auctionid;
    mapping(address => BidDetails) _biddetails;
    uint256 _amount_to_be_paid;
    address payable _winner;

    constructor(
        uint256 minamount,
        string memory auctionId,
        address auctionCreator
    ) {
        _auctionid = auctionId;
        _minamount = minamount;
        _auctionowner = payable(auctionCreator);
    }

    modifier canBid(address bidderAddress) {
        require(
            _biddetails[bidderAddress]._hasBid == false,
            "you have already bid!!!"
        );
        _;
    }
    modifier canReveal(address bidderAddress) {
        require(
            _biddetails[bidderAddress]._hasRevealed == false,
            "you have already bid!!!"
        );
        _;
    }



    function commitBid(bytes32 _secretBid, address _address) private {
        _biddetails[_address]._hasBid = true;
        _biddetails[_address]._bidHash = _secretBid;
        emit BidCommitted(_address, _auctionid);
    }


    function commit(address _bidderAddress, bytes32 hash) external canBid(_bidderAddress) {
        commitBid(hash, _bidderAddress);
        _bidders.push(payable(_bidderAddress));
    }

    function revealBid(
        address bidderAddress,
        uint bidAmt,
        string calldata secretSalt
    ) external canReveal(bidderAddress) {
        bytes32 _hashBidAmt = keccak256(abi.encode(bidAmt));
        require(
            keccak256(abi.encode(_hashBidAmt, secretSalt)) ==
                _biddetails[bidderAddress]._bidHash,
            "bid amount and salt doesnot match !!!"
        );
        _biddetails[bidderAddress]._hasRevealed = true;
        _biddetails[bidderAddress]._bidamount = bidAmt;
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
            _winner = payable(_bidders[0]);
            _amount_to_be_paid = _biddetails[_winner]._bidamount;
        } else {
            for (uint256 i = 1; i < _length; ++i) {
                if (!_biddetails[_bidders[i]]._hasRevealed) {
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
            } else if (_biddetails[_bidders[i]]._hasRevealed) {
                _bidders[i].transfer(_biddetails[_bidders[i]]._bidamount);
            }
        }
        _auctionowner.transfer(_amount_to_be_paid);
    }
}
