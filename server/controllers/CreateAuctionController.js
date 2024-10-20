const AuctionDetails = require('../models/CreateAuctionModel');

const createAuction = async (req, res) => {
    const { address, auctionId, auctionproduct, description, start_of_auction, add_images, cover_image, min_eth, auctionname } = req.body;
    try {
        const newAuction = new AuctionDetails({
            auctionname,
            auctionId,
            owner: address,
            auctionproduct,
            description,
            start_of_auction,
            add_images,
            cover_image,
            min_eth
        });
        await newAuction.save();
        res.status(201).json({ message: 'Auction created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in creating auction' });
    }

}


const checkAuction = async (req, res) => {
    try {
        const { auctionname } = req.body;
        const auction = await AuctionDetails.findOne({ auctionname });
        if (auction) {
            res.status(200).json({ message: 'Auction already exists' });
        } else {
            res.status(400).json({ message: 'Auction does not exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in creating auction' });

    }
}
module.exports = { createAuction, checkAuction };