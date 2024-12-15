const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://admin:OgIblB6FmeZ52zMQ@cluster0.44jo5.mongodb.net/hotel-booking`, {
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
