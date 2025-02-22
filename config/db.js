const mongoose = require("mongoose");

const connectDB = async () => {

    try {
        await mongoose.connect("mongodb://localhost:27017/db_vitalFlow");
        console.log("MongoDB connected");
    } catch (e) {
        console.log("MongoDB is not Connected")
    }
}
module.exports = connectDB;