const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const CreateAuctionRouter = require('./routes/CreateAuctionRouter');
require('dotenv').config();
const corsOptions = {
    origin: 'http://localhost:5173',
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

module.exports = app;
