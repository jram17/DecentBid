const router = require('express').Router();
const { auctionDetails, getAuctions } = require('../controllers/GetAuctionsController');
router.get('/', getAuctions);

router.get('/:id', auctionDetails);

module.exports = router;