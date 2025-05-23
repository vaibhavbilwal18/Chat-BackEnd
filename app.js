const express = require('express');
require('dotenv').config();
const connectDB = require('./src/config/database');
const authRouter = require('./src/routes/auth.js');
const profileRouter = require('./src/routes/profile.js');
const chatRouter = require('./src/routes/chatRoutes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET,POST',
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);   
app.use('/', profileRouter);  
app.use('/', chatRouter);  

connectDB().then(() => {    
  console.log('Database connected');
  app.listen(7777, () => {
    console.log(`Server is running on port 7777`);
  });
}).catch((error) => {
  console.error('Database Not Connected', error);
});
