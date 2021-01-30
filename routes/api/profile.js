const express = require('express');
const request = require('request');
const config = require('config')
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Posts')

// @router GET api/profile/me
// @desc Get current user's profile
// @access private
router.get('/me', auth, async (req, res) => {
    // auth--> makes the route protected
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']) //to get the name and avatar from the user model as they are not in the profile model
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})



// @router POST api/profile
// @desc Create or update user's profile
// @access private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body; // Destructuring

    //Build profile object
    const profileFields = {}
    profileFields.user = req.user.id; //known from the token
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
        // Changes the string with ',' separates to array elements 
        // Trim is used to remove all unneeded surrounding spaces
    }

    //Build social object
    profileFields.social = {} //if we don't intialize it there will be an error
    profileFields.user = req.user.id;
    if (youtube) profileFields.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id })
        if (profile) {
            // Update profile
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })

            return res.json(profile)
        }

        // Create a profile if not there a profile 
        profile = new Profile(profileFields)
        await profile.save() //saving to db

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})

// @router PUT api/profile/experience
// @desc add profile expreince
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //destructuring
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title, // instead of title(varname): title(the input value)
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.experience.unshift(newExp) // unshift is the same as push function but the most recent is first not last
        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})

// @router DELETE api/profile/experience/_exp:id
// @desc dlete profile expreince
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //Get remove expereince array index 
        const removeIndex = profile.experience.map(item => item.id.indexOf(req.params.exp_id))

        profile.experience.splice(removeIndex, 1) //removing an expereince from the experience array, not all of them jsut that one having the id passed in the request

        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})


// @router PUT api/profile/education
// @desc add profile education
// @access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //destructuring
    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school, // instead of school(var): school(input)
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.education.unshift(newEdu) // unshift is the same as push function but the most recent is first not last
        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})


// @router DELETE api/profile/education/_edu:id
// @desc dlete profile education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //Get remove expereince array index 
        const removeIndex = profile.education.map(item => item.id.indexOf(req.params.edu_id))

        profile.education.splice(removeIndex, 1) //removing an education from the education array, not all of them jsut that one having the id passed in the request

        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})



// @router GET api/profile/github/:username
// @desc Get user repos from GitHub
// @access Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No GitHub profile found !' })
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error !')
    }
})


// @router GET api/profile
// @desc Get all profiles
// @access public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']) //get the name and avatar from the UserSchema
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})



// @router GET api/profile/user/:user_id
// @desc Get a user profile by its id
// @access public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']) //get the name and avatar from the UserSchema

        if (!profile) {
            res.status(400).json('Profile not found..')
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') { //If the id is not valid still we want to send this message not 'Server Error !'
            res.status(400).json('Profile not found..')
        }
        res.status(500).send('Server Error !')
    }
})


// @router DELETE api/profile
// @desc delete profiles, users and posts
// @access Private
router.delete('/', auth, async (req, res) => { // private --> we have token so we add middleware making it private
    try {
        // Remove posts
        await Post.deleteMany({ user: req.user.id })

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id })

        // Remove user
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: ' User is deleted..' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})



module.exports = router;