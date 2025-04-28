const express = require('express');
const authRouter = express.Router();
const { validationSignUpData } = require('../utils/validation');
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const validator = require('validator');

//Signup route
authRouter.post('/signup', async (req, res) => {
    try {
        await validationSignUpData(req);

        const { firstName, lastName, email, password } = req.body;

        if (!validator.isStrongPassword(password, { minSymbols: 1 })) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        const savedUser = new User({
            firstName,
            lastName,
            email,
            password,
        });
        
        await savedUser.save();
        const token = await savedUser.generateAuthToken();


        res.cookie('auth_token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'This email is already in use. Please choose another one.' });
        }
        res.status(400).send("Error :"  + err.message);
    }
});

//Login route
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = await user.generateAuthToken();

        res.cookie('auth_token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
});

//Logout route
authRouter.post('/logout', async (req, res) => {
    try {
      const token = req.cookies.auth_token;
      
      if (!token) {
        return res.status(200).json({ message: 'Already logged out' });
      }
      
      const user = await User.findOne({
        tokens: token  
      });
      
      if (!user) {
        res.clearCookie('auth_token');
        return res.status(200).json({ message: 'Logged out successfully' });
      }
      
      user.tokens = user.tokens.filter((t) => t !== token);
      await user.save();
      
      res.clearCookie('auth_token');
      
      return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Server error during logout' });
    }
  });
  

module.exports = authRouter;
