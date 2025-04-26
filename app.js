const express = require('express');
require('dotenv').config();
const connectDB = require('./src/config/database');
const authRouter = require('./src/routes/auth.js');
const cookieParser = require('cookie-parser');  // Add this line



const app = express();

app.use(express.json());
app.use(cookieParser());  // Add this line

app.use('/', authRouter);

connectDB().then(() => {
  console.log('Database connected');
  app.listen(7777, () => {
    console.log(`Server is running on port 7777`);
  });
}).catch((error) => {
  console.error('Database Not Connected', error);
});
