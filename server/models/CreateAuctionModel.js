const mongoose = require('mongoose');

// Define the schema
const AuctionSchema = new mongoose.Schema({
    owner: String,
    auctionname: String,
    auctionproduct: String,
    auctionId: String,
    description: String,
    min_eth: Number,
    cover_image: String,
    add_images: [String],
    start_of_auction: Date,
    isCommitEnabled: {
        type: Boolean,
        default: true
    },
    isRevealEnabled: {
        type: Boolean,
        default: false
    },
    isWinnerAnnounced: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const AuctionDetails = mongoose.models.Apartments || mongoose.model('AuctionDetails', AuctionSchema);

module.exports = AuctionDetails;
