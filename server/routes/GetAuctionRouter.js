const router = require('express').Router();
const { auctionDetails, getAuctions } = require('../controllers/GetAuctions');
router.get('/:id', auctionDetails);
router.get('/', getAuctions);

module.exports = router;