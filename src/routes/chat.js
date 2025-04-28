const chatRouter = require('express').Router();
const { auth } = require('../middleware/userauth');
const User = require('../models/user');
const Message = require('../models/message');

// Get all users
chatRouter.get('/chat/users', auth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password ');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong..!!' });
    }
});

// Get user profile
chatRouter.get('/chat/user/profile/:receivedId', auth, async (req, res) => {
    try {
        const receiverId = req.params.receivedId;
        const user = await User.findById(receiverId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something Went Wrong..!!' });
    }
});

// Get user messages
chatRouter.get('/chat/user/messages/:receiverId', auth, async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong..!!' });
    }
});

module.exports = chatRouter;
