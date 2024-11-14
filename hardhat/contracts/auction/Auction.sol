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
    address[] __revealedbidders;

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
        main_parent = Main(payable(msg.sender));
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
        uint256 weiValue,
        string memory secretSalt
    ) external canReveal(bidderAddress) {
        bytes32 _hashBidAmt = keccak256(abi.encode(weiValue));
        bool status = keccak256(abi.encode(_hashBidAmt, secretSalt)) ==
            _biddetails[bidderAddress]._bidHash;
        if (status) {
            AfterReveal(bidderAddress, status);
            _biddetails[bidderAddress]._hasRevealed = true;
            _biddetails[bidderAddress]._bidamount = weiValue;
            __revealedbidders.push(bidderAddress);
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

        uint revealed_bidders = __revealedbidders.length;
        require(revealed_bidders > 0, "No revealed bids available");

        for (uint i = 0; i < revealed_bidders - 1; i++) {
            for (uint j = i + 1; j < revealed_bidders; j++) {
                if (
                    _biddetails[__revealedbidders[j]]._bidamount >
                    _biddetails[__revealedbidders[i]]._bidamount
                ) {
                    address temp = __revealedbidders[i];
                    __revealedbidders[i] = __revealedbidders[j];
                    __revealedbidders[j] = temp;
                }
            }
        }

        _winner = payable(__revealedbidders[0]);
        address payable _secondHighestBidder;
        if (revealed_bidders == 1) {
            _secondHighestBidder = _winner;
            _amount_to_be_paid = _biddetails[_secondHighestBidder]._bidamount;

            return _winner;
        }
        _secondHighestBidder = payable(__revealedbidders[1]);
        _amount_to_be_paid = _biddetails[_secondHighestBidder]._bidamount;

        return _winner;
    }

    function transferAmount() public returns (bool) {
        require(_winner != address(0), "reveal the winner first");
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
        main_parent.increaseCred(_winner, 20, true);
        _auctionowner.transfer(_amount_to_be_paid);
        return true;
    }
}
