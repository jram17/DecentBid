// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import "hardhat/console.sol";

contract Auction {
    event unRevealed(address indexed bidder, string indexed _auctionid);
    event Winner(address indexed winner, string indexed _auctionid);

    struct BidDetails {
        bytes32 _bidHash;
        string _secretSalt;
        uint256 _bidamount;
        bool _hasBid;
        bool _hasRevealed;
    }

    address payable[] _bidders;
    uint256 _minamount;
    address payable _auctionowner;
    string _auctionid;
    mapping(address => BidDetails) _biddetails;
    uint256 _amount_to_be_paid;
    address payable _winner;

    // uint private commitEndTime;
    // uint private revealEndTime;

    constructor(
        uint256 minamount,
        string memory auctionId // uint256 commitTime, // uint256 revealTime
    ) {
        _auctionowner = payable(msg.sender);
        _auctionid = auctionId;
        _minamount = minamount;
        // commitEndTime = block.timestamp + commitTime;
        // revealEndTime = commitEndTime + revealTime;
    }

    // modifier commitPhase(){
    //     require(block.timestamp < commitEndTime && block.timestamp>=block.timestamp-1 ,"commit phase is over");
    //     _;
    // }

    // modifier revealPhase(){
    //     require( block.timestamp < revealEndTime, "reveal phase is over");
    //     _;
    // }
    // modifier revealPhasestart(){
    //     require(block.timestamp > commitEndTime, "reveal phase dint start");
    //     _;
    // }

    modifier canBid() {
        require(
            _biddetails[msg.sender]._hasBid == false,
            "you have already bid!!!"
        );
        _;
    }
    modifier canReveal() {
        require(
            _biddetails[msg.sender]._hasRevealed == false,
            "you have already bid!!!"
        );
        _;
    }

    function commitBid(bytes32 _secretBid) private {
        _biddetails[msg.sender]._hasBid = true;
        _biddetails[msg.sender]._bidHash = _secretBid;
        console.log("heree");
    }

    // function getHash(uint _amt) public pure returns (bytes32) {
    //     return keccak256(abi.encodePacked(_amt));
    // }

    function payminAmount() public payable {
        require(msg.value == _minamount, "Less than the minimum amount");

        (bool sent, ) = _auctionowner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function payCommitBidAmount() public payable {
        (bool sent, ) = _auctionowner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function commit(
        bytes32 bidAmt,
        string calldata secretSalt
    ) external canBid {
        commitBid(keccak256(abi.encodePacked(bidAmt, secretSalt)));
        _bidders.push(payable(msg.sender));
    }

    function revealBid(
        uint bidAmt,
        string calldata secretSalt
    ) external canReveal {
        // bytes32 _hashBidAmt = getHash(bidAmt);
        bytes32 _hashBidAmt = keccak256(abi.encodePacked(bidAmt));
        require(
            keccak256(abi.encodePacked(_hashBidAmt, secretSalt)) ==
                _biddetails[msg.sender]._bidHash,
            "bid amount and salt doesnot match !!!"
        );
        _biddetails[msg.sender]._hasRevealed = true;
        _biddetails[msg.sender]._bidamount = bidAmt;
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
