const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: {
          values: ["Male", "Female", "other"],
          message: `{VALUE} is not a valid gender type`,
        },
    },
    about: {
        type: String,
        default: 'I am using this app',
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL');
            }
        }
    }
},
{
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});



userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const User = mongoose.model('User', userSchema);
module.exports =  User ;