const {auth} = require('../middleware/userauth');
const {validationDataUpdate} = require('../utils/validation');

const profileRouter = require('express').Router();

// Get user profile
profileRouter.get('/profile/view', auth, async (req, res) => {

    try{
        const user = req.user;
        res.send(user);
    }catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Update user profile
profileRouter.patch('/profile/update', auth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        
        if(!validationDataUpdate(req)){
            throw new Error('Invalid Edit Request');
        }

        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
              loggedInUser[key] = req.body[key];
            }
          });
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName} Profile Update Succefully`);
    }catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
module.exports = profileRouter;