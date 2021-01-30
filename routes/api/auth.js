const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

// @router GET api/auth
// @desc Test route
// @access public
router.get('/', auth, async (req, res) => {
    //inserting auth (middleware function) making it protected

    try {
        const user = await User.findById(req.user.id).select('-password') //inorder not to return the password with the user data
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


// @router POST api/auth
// @desc Authenticate user and get token
// @access public
router.post('/', [
    // Checking the required specifications of the entered data
    check('email', 'Please include a valid email !').isEmail(),
    check('password', 'Password is required !').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body; // destructuring

        try {
            // Check if the user exists
            let user = await User.findOne({ email }) //short for email(the value just been input ): email(each email value in the database)
            if (!user) {
                res.status(400).json({ errors: [{ msg: 'Invalid credintials..' }] })
                //We didn't specify the invalid input in the email error nor the password; so that if someone wanted to check if a user existed or not.
                //Making both errors have the same msg is more secure
            }

            // Checking password
            const isMatch = await bcrypt.compare(password, user.password) //entered password then the password of the matched email in the db
            if (!isMatch) {
                res.status(400).json({ errors: [{ msg: 'Invalid credintials..' }] })
            }

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id //it's ok not to use ._id with mongodb it's familiar with it
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token }) //else
                }
            )

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error ..!')
        }
    })


module.exports = router;