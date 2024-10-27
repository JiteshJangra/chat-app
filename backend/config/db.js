const mongoose = require("mongoose")
const colors =require("colors")
const connectDB = async () =>
{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;