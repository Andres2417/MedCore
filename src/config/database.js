const mongoose = require('mongoose');
require ('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL, {});
        console.log(`MongoDB connected: ${conn.connection.name}`);

        
    } catch (error) {
        console.log(error);
        proccess.exit(1);
    }

};

module.exports = connectDB;