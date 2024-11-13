const AuctionDetails = require('../models/CreateAuctionModel');
const UserAuctions = require('../models/UserAuctionsModel')

const getAuctions = async (req, res) => {
    try {
        const auctions = await AuctionDetails.find({ isWinnerAnnounced: false }).sort({
            "timestamp": -1
        });
        res.status(200).json(auctions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting auctions' });
    }
}

const auctionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }

        const auction = await AuctionDetails.findOne({ auctionId: id }).sort({
            "timestamp": -1
        });

        if (!auction) {
            return res.status(400).json({ message: 'Auction not found' });
        }

        res.status(200).json(auction);
    } catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).json({ message: 'Error retrieving auction details' });
    }
};

const userAuctions = async (req, res) => {
    try {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        const userAuctions = await UserAuctions.findOne({ address });

        if (!userAuctions) {
            return res.status(400).json({ message: 'User auctions not found' });
        }

        const AuctionDetails = await UserAuctions.map

        res.status(200).json(userAuctions);

    } catch (error) {
        console.error('Error fetching user auctions:', error);
        res.status(500).json({ message: 'Error retrieving user auctions' });

    }
}

const updatingUserAuctions = async (req, res) => {
    try {
        const { address, auctionId } = req.body;
        if (!address || !auctionId) {
            return res.status(400).json({ message: 'Address and auctionId are required' });
        }

        const userAuctions = await UserAuctions.findOne({ address });

        if (!userAuctions) {
            const userAuctions = new UserAuctions({
                address: address,
                auctionIds: [auctionId]
            })
            await userAuctions.save();
        } else {
            userAuctions.auctionIds.push(auctionId);
            await userAuctions.save();
        }

        res.status(200).json(userAuctions);

    } catch (error) {
        console.error('Error updating user auctions:', error);
        res.status(500).json({ message: 'Error updating user auctions' });

    }
}

const getOwningAuctions = async (req, res) => {
    try {
        const { owner } = req.params;
        if (!owner) {
            return res.status(401).json({ message: 'Owner address is required' });
        }
        const auctions = await AuctionDetails.find({ owner });
        if (!auctions) {
            return res.status(400).json({ message: 'Auctions not found' });
        }

        res.status(200).json(auctions);


    } catch (error) {

    }
}


const updateRevealPhase = async (req, res) => {
    try {


        const { id: auctionId } = req.params;

        if (!auctionId) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }

        const auction = await AuctionDetails.findOne({ auctionId });

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        auction.isRevealEnabled = true;
        auction.isCommitEnabled = false;
        await auction.save();


        res.status(200).json({
            success: true,
            message: 'Reveal phase enabled successfully'
        });

    } catch (error) {
        console.error('Error enabling reveal phase:', error);
        res.status(500).json({ message: 'An error occurred while enabling the reveal phase' });
    }
};

const updateWinner = async (req, res) => {
    try {


        const { id: auctionId, winner } = req.body;

        if (!auctionId) {
            return res.status(400).json({ message: 'Auction ID is required' });
        }

        const auction = await AuctionDetails.findOne({ auctionId });

        if (!auction) {
            return res.status(400).json({ message: 'Auction not found' });
        }
        if (!auction.isRevealEnabled) {
            return res.status(400).json({ message: 'Reveal phase not enabled' });
        }
        auction.isWinnerAnnounced = true;
        auction.isRevealEnabled = false;
        auction.winner = winner;
        await auction.save();


        res.status(200).json({
            success: true,
            message: 'Winner was successfully declared'
        });

    } catch (error) {
        console.error('Error enabling reveal phase:', error);
        res.status(500).json({ message: 'An error occurred while enabling the reveal phase' });
    }
};





module.exports = { auctionDetails, getAuctions, getOwningAuctions, updatingUserAuctions, userAuctions, updateRevealPhase, updateWinner };