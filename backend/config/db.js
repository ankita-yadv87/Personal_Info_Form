const mongoose = require("mongoose");



const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}




module.exports = connectDatabase;