const router = require('express').Router();
const { auctionDetails, getAuctions, getOwningAuctions, updatingUserAuctions, userAuctions } = require('../controllers/GetAuctionsController');

router.get('/', getAuctions);
router.get('/own-auctions/:owner', getOwningAuctions);
router.put('/user-auctions', updatingUserAuctions);
router.get('/user-auctions/:address', userAuctions);
router.get('/:id', auctionDetails);

module.exports = router;