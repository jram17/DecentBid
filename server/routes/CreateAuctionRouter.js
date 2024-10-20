const express = require('express');
const router = express.Router();
const { createAuction, checkAuction } = require('../controllers/CreateAuctionController');

router.post('/', createAuction);
router.post('/check-auction', checkAuction);

module.exports = router;