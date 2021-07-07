const express = require('express')

const Post = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({
                message: 'The posts information could not be retrieved',
                error: err.message
            })
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The post information could not be retrieved',
                error: err.message
            })
        })
})

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({
            message: 'message: "Please provide title and contents for the post'
        })
    } else {
        Post.insert(req.body)
            .then(post => {
                Post.findById(post.id)
                    .then(newPost => {
                        res.status(201).json(newPost)
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'Something went wrong when creating the post ID',
                            error: err.message
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    message: 'There was an error while saving the post to the database',
                    error: err.message
                })
            })
    }
})

router.put('/:id', (req, res) => {
    const changes = req.body
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Post.update(req.params.id, changes)
            .then(post => {
                if (post) {
                    Post.findById(post)
                        .then(updatedPost => {
                            res.status(200).json(updatedPost)
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: 'Something went wrong when updating the post',
                                error: err.message
                            })
                        })
                } else {
                    res.status(404).json({
                        message: 'The post with the specified ID does not exist'
                    })
                }
                
            })
            .catch(err => {
                res.status(500).json({
                    message: 'The post information could not be modified',
                    error: err.message
                })
            })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist',
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The post could not be removed',
            err: err.message
        })
    }
})

module.exports = router