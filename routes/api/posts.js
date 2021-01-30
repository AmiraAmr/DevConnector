const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator')
// const request = require('request');
// const config = require('config')

const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @router POST api/posts
// @desc Create a post
// @access Private
router.post('/', [auth,
    check('text', 'text is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save()
        res.json(post)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})

// @router GET api/posts
// @desc Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }) // the most recent is first
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})

// @router GET api/posts/:id
// @desc Get post by id
// @access Public
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found !' })
        }

        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})

// @router DELETE api/posts/:id
// @desc Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found !' })
        }

        // Checking that the user deleting the post is the user own it
        if (post.user.toString() !== req.user.id) {//  we used toString() bec post.user is an object id not id
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove()
        res.json('Post is removed..')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})


// @router PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Check if the post has been already liked by this user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'This post is already liked' })
        }

        post.likes.unshift({ user: req.user.id })
        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})



// @router PUT api/posts/unlike/:id
// @desc Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //Check if the post has been already liked by this user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'This post has not been liked yet' })
        }

        // Get the remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)

        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})


// @router POST api/posts/comment/:id
// @desc Comment on a post
// @access Private
router.post('/comment/:id', [auth,
    check('text', 'text is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        const newComment = { // leh 3mlnah object 3ady? 3shan mfeesh ll comments schema ?
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        post.comments.unshift(newComment) //3ayza a5leha push bdal shift 3shan el newest yb2a last
        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})


// @router DELETE api/posts/comment/:id/:comment_id
// @desc Delete a comment on a post
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const post = await Post.findById(req.params.id)
        // Search for this comment in this post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        // Make sure that this comment exists
        if (!comment) {
            return res.status(400).json({ msg: 'This comment does not exist' })
        }
        // Make sure that the user want to delete the comment is the same who wrote it
        if (comment.user.toString() !== req.user.id) {
            return res.status(400).json({ msg: 'User not authorized' })
        }
        // Get the remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)

        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})



module.exports = router;