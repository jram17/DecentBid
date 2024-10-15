require('dotenv').config();
const app = require('.');
const dbConnection =require('./config/dbconfig');
const startServer = async () => {
    const port = process.env.PORT || 5000;
    try {
        await dbConnection(process.env.MONGO_URI);
        app.listen(3000, () => {
        console.log(`Server is listening on ${port}`);
    });

    } catch (error) {
        
    }
}

startServer();