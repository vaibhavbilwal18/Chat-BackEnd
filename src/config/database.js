const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = async () => {
      await mongoose.connect(process.env.DATABASE_STRING);

}
 module.exports =  connectDB ;