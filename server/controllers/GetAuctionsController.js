const AuctionDetails = require('../models/CreateAuctionModel');


const getAuctions = async (req, res) => {
    try {
        const auctions = await AuctionDetails.find({});
        res.status(200).json(auctions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting auctions' });
    }
}

const auctionDetails = async (req, res) => {
    try {
        const { id } = req.params;

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

module.exports = { auctionDetails, getAuctions };