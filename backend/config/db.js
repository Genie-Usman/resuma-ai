const mongoose = require("mongoose");

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB connected');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        console.log('Note: Please configure a valid MONGO_URI in backend/.env (e.g. MongoDB Atlas or start local MongoDB).');
    }
};

module.exports = connectDB;