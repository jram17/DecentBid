const AuctionDetails = require('../models/CreateAuctionModel');
const UserAuctions = require('../models/UserAuctionsModel')

const getAuctions = async (req, res) => {
    try {
        const auctions = await AuctionDetails.find({ isWinnerAnnounced: false });
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

        const auction = await AuctionDetails.findOne({ auctionId: id });

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


module.exports = { auctionDetails, getAuctions, getOwningAuctions, updatingUserAuctions, userAuctions };