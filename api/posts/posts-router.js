const express = require('express')

const Post = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
})

module.exports = router