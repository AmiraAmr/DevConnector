const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User') //Getting the UserSchema

// @router POST api/users
// @desc Register user
// @access public
router.post('/', [
    // Checking the required specifications of the entered data
    check('name', 'Name is required !').not().isEmpty(),
    check('email', 'Please include a valid email !').isEmail(),
    check('password', '6 or more characters required for the password !').isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body; // destructuring

        try {
            // Check if the user exists
            let user = await User.findOne({ email }) //short for email(the value just been input ): email(each email value in the database)
            if (user) {
                res.status(400).json({ errors: [{ msg: 'User alreay exists..' }] })
            }

            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200', //size
                r: 'pg', //raiding? pg->هي حاجة ليها علاقة بالمعايير الأخلاقية
                d: 'mm' //default mm-> user icon default, we can use 404 which is not good
            })

            //creating the new entered user passing its data to the schema.. but not yet saved to the db
            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Encrypt password
            const salt = await bcrypt.genSalt(10); //to be hashed returning a promise (i think such as picking a method or sth) , 10 is recommended in the documentation
            // NOTE***** anything returns promise we should put await when using async await
            user.password = await bcrypt.hash(password, salt)

            await user.save() //saving to db

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