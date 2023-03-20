const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

//CREATE POST
router.post('/', async (req, res) => {
    console.log('req-body===', req.body);
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE POST
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );
                res.status(200).json(updatedPost);
            } catch (err) {
                res.status(401).json(err);
            }
        } else {
            res.status(401).json('You can update only your post'); //клиент не был авторизован
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE
router.delete('/:id', async (req, res) => {
    console.log('del1');
    try {
        const post = await Post.findById(req.params.id);
        console.log('del2');
        if (post.username === req.body.username) {
            console.log('del3');
            try {
                console.log('del4');
                console.log(post);
                await Post.findByIdAndDelete(req.params.id);
                console.log('del');
                res.status(200).json('Post has been deleted');
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json('You can delete only your post'); //клиент не был авторизован
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL POSTS
router.get('/', async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (catName) { 
        posts = await Post.find({
            categories: {
                $in: [catName]
            }
        });
    } else {
        posts = await Post.find();
    }
    res.status(200).json(posts);
} catch (err) {
    res.status(500).json(err);
}
});


module.exports = router;