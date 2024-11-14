// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "hardhat/console.sol";
import "../Main.sol";

contract Auction {
    receive() external payable {}

    event unRevealed(address indexed bidder, string indexed _auctionid);

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
    uint winnerRevealTime;
    address payable _winner;
    Main main_parent;

    constructor(
        uint256 minamount,
        string memory auctionId,
        address auctionCreator
    ) {
        _auctionid = auctionId;
        _minamount = minamount;
        _auctionowner = payable(auctionCreator);
        main_parent = Main(msg.sender);
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

    function AfterReveal(address bidderAddress, bool status) internal {
        console.log(status);
        if (status) {
            main_parent.increaseCred(bidderAddress, 10, true); // success reveal
        } else {
            main_parent.increaseCred(bidderAddress, 5, false); // fail reveal
        }
    }

    function AfterWin(address bidderAddress) internal {
        main_parent.increaseCred(bidderAddress, 10, true); // success win
    }

    function commit(
        address _bidderAddress,
        bytes32 hash
    ) external canBid(_bidderAddress) {
        _bidders.push(payable(_bidderAddress));
        _biddetails[_bidderAddress]._hasBid = true;
        _biddetails[_bidderAddress]._bidHash = hash;
    }

    function revealBid(
        address bidderAddress,
        uint256 bidAmt,
        string memory secretSalt
    ) external canReveal(bidderAddress) {
        uint256 weiValue = bidAmt * 1e18;
        bytes32 _hashBidAmt = keccak256(abi.encode(weiValue));
        bool status = keccak256(abi.encode(_hashBidAmt, secretSalt)) ==
            _biddetails[bidderAddress]._bidHash;
        if (status) {
            AfterReveal(bidderAddress, status);
            _biddetails[bidderAddress]._hasRevealed = true;
            _biddetails[bidderAddress]._bidamount = weiValue;
        } else {
            AfterReveal(bidderAddress, status);
        }

        // require(
        //     keccak256(abi.encode(_hashBidAmt, secretSalt)) ==
        //         _biddetails[bidderAddress]._bidHash,
        //     "bid amount and salt doesnot match !!!"
        // );
        // _biddetails[bidderAddress]._hasRevealed = true;
        // _biddetails[bidderAddress]._bidamount = weiValue;
    }

    function getAuctionWinner() public payable returns (address payable) {
        require(_bidders.length > 0, "No bidding has been produced yet");

        uint256 _length = _bidders.length;
        _winner = _bidders[0];
        address payable _secondlastelement;

        if (_length == 1) {
            _amount_to_be_paid = _biddetails[_winner]._bidamount;

            return _winner;
        } else if (_length > 1) {
            _secondlastelement = _bidders[1];
            for (uint256 i = 1; i < _length; ++i) {
                if (!_biddetails[_bidders[i]]._hasRevealed) {
                    emit unRevealed(_bidders[i], _auctionid);
                    continue;
                }

                if (
                    _biddetails[_bidders[i]]._bidamount >
                    _biddetails[_winner]._bidamount
                ) {
                    _secondlastelement = payable(_winner);
                    _winner = _bidders[i];
                } else if (
                    _biddetails[_bidders[i]]._bidamount >
                    _biddetails[_secondlastelement]._bidamount
                ) {
                    _secondlastelement = _bidders[i];
                }
            }
        }

        require(
            _secondlastelement != address(0),
            "No second highest bidder found"
        );

        _amount_to_be_paid = _biddetails[_secondlastelement]._bidamount;
        console.log(_winner);
        console.log(_amount_to_be_paid);
        return _winner;
    }

    function transferAmount() public returns (bool) {
        require(_winner != address(0), "reveal the winner first");
        uint256 _length = _bidders.length;
        for (uint256 i = 0; i < _length; ++i) {
            if (_bidders[i] == _winner) {
                console.log(_winner);
                console.log(_amount_to_be_paid);
                _winner.transfer(
                    _biddetails[_bidders[i]]._bidamount - _amount_to_be_paid
                );
            } else if (_biddetails[_bidders[i]]._hasRevealed) {
                console.log(_bidders[i]);
                console.log(_amount_to_be_paid);
                _bidders[i].transfer(_biddetails[_bidders[i]]._bidamount);
            }
        }
        _auctionowner.transfer(_amount_to_be_paid);
        return true;
    }
}
