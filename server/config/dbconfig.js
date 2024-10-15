const mongoose = require('mongoose');

// Connect to MongoDB
async function DbConnect(mongoUri) {
    try {
        
        const connect = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to Mongodb Database`);
    } catch (error) {
        console.error(`Failed to connect to Mongodb`, error);
        process.exit(1); 
    }
}

module.exports = DbConnect;
