const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const CreateAuctionRouter = require('./routes/CreateAuctionRouter');
const auctionsDetails = require("./routes/GetAuctionRouter");
require('dotenv').config();
const dbConnection = require('./config/dbconfig');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
app.use('/create-auction', CreateAuctionRouter);
app.use('/auctions', auctionsDetails);
const startServer = async () => {
    const port = process.env.PORT || 5000;
    try {
        await dbConnection(process.env.MONGO_URI);
        app.listen(3000, () => {
            console.log(`Server is listening on ${port}`);
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);

    }
}

startServer();


