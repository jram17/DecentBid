require('dotenv').config();
const app = require('.');
const startServer = () => {
    const port = process.env.PORT || 5000;
    app.listen(3000, () => {
        console.log(`Server is listening on ${port}`);
    });
}

startServer();