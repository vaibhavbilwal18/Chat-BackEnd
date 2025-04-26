const validator = require('validator');


const validationSignUpData = (req) => {
    const { firstName, lastName, email , password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
    }
    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
        throw new Error('First name and last name must be strings');
    }
    if (firstName.length < 2 || firstName.length > 20) {
        throw new Error('First name must be between 2 and 20 characters long');
    }
    if (lastName.length < 2 || lastName.length > 20) {
        throw new Error('Last name must be between 2 and 20 characters long');
    }
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email address');
    }
    if (password.length < 8 || password.length > 15) {
        throw new Error('Password must be between 8 and 15 characters long');
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
}



module.exports = {validationSignUpData};