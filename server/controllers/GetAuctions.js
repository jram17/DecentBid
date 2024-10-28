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
        const { auctionId } = req.params;
        const auction = await AuctionDetails.findOne({ auctionId });
        res.status(200).json(auction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in getting auctions' });

    }


}

module.exports = { auctionDetails, getAuctions };