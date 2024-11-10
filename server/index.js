const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const CreateAuctionRouter = require('./routes/CreateAuctionRouter');
const auctionsDetails = require("./routes/GetAuctionRouter");
require('dotenv').config();
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use('/create-auction', CreateAuctionRouter);
app.use('/auctions', auctionsDetails);

module.exports = app;
