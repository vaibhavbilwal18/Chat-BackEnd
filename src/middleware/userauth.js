const jwt = require('jsonwebtoken');
const  User  = require('../models/user');

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.auth_token; // <-- change here
        if (!token) {
            return res.status(401).json({ message: 'Please Login First...!!' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decoded;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ message: 'Please Login First...!!!' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized User..!!' });
    }
}

module.exports = { auth };
