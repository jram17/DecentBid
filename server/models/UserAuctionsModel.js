const mongoose = require('mongoose');

// Define the schema
const UserAuctionSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    auctionIds: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const UserAuctions = mongoose.models.Apartments || mongoose.model('UserAuctions', UserAuctionSchema);

module.exports = UserAuctions;
