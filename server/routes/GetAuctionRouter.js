const router = require('express').Router();
const { auctionDetails, getAuctions, getOwningAuctions, updatingUserAuctions, userAuctions, updateRevealPhase, updateWinner } = require('../controllers/GetAuctionsController');


router.put('/enable-reveal/:id', updateRevealPhase);
router.put('/reveal-winner', updateWinner);
router.get('/', getAuctions);
router.get('/own-auctions/:owner', getOwningAuctions);
router.put('/user-auctions', updatingUserAuctions);
router.get('/user-auctions/:address', userAuctions);
router.get('/:id', auctionDetails);

module.exports = router;